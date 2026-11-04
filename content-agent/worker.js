/**
 * The PM — Studio content agent (Cloudflare Worker)
 * GitHub OAuth (allowlisted users) + OpenRouter → preview → commit to main
 */

const REPO = "Yevucee/pm-website";
const BRANCH = "main";
const ALLOWED_PREFIXES = ["content/", "public/uploads/"];
const BLOCKED_PREFIXES = ["content/../", "public/../"];
const PROPOSAL_TTL_MS = 60 * 60 * 1000;
const MAX_PROPOSAL_BYTES = 4 * 1024 * 1024;

function allowedOrigins(env) {
  const raw = String(env.ALLOWED_ORIGINS || "").trim();
  if (!raw) {
    return [
      "https://www.theonlypm.com",
      "https://theonlypm.com",
      "https://yevucee.github.io",
      "http://localhost:5173",
    ];
  }
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  return allowedOrigins(env).some(
    (o) => origin === o || origin.startsWith(o + "/") || origin === o.replace(/\/$/, ""),
  );
}

function corsHeaders(origin, env) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (isAllowedOrigin(origin, env)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  return headers;
}

function corsPreflight(origin, env) {
  return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
}

function json(body, status, origin, env, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin, env),
      ...extraHeaders,
    },
  });
}

function allowedLogins(env) {
  return String(env.ALLOWED_GITHUB_USERS || "Yevucee")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function handleLogin(url, env) {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
  }

  const returnTo = url.searchParams.get("return_to") || "https://www.theonlypm.com/studio";
  if (!isSafeReturnUrl(returnTo, env)) {
    return new Response("Invalid return_to", { status: 400 });
  }

  const state = crypto.randomUUID();
  const statePayload = `${state}.${btoa(JSON.stringify({ returnTo, ts: Date.now() }))}`;
  const redirectUri = `${url.origin}/studio/oauth/callback`;

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "repo");
  authUrl.searchParams.set("state", statePayload);

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `studio_oauth_state=${encodeURIComponent(state)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  );
  headers.append("Location", authUrl.toString());

  return new Response(null, { status: 302, headers });
}

function isSafeReturnUrl(returnTo, env) {
  try {
    const u = new URL(returnTo);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const allowed = allowedOrigins(env);
    const origin = u.origin;
    return allowed.some((o) => {
      const normalized = o.replace(/\/$/, "");
      return origin === normalized || origin === o;
    });
  } catch {
    return false;
  }
}

async function handleOAuthCallbackFromRequest(url, env, request) {
  const cookieMap = parseCookies(request?.headers?.get("Cookie") || "");
  const stateCookie = cookieMap.studio_oauth_state;
  const stateParam = url.searchParams.get("state") || "";
  const [stateId] = stateParam.split(".");
  if (!stateCookie || stateCookie !== stateId) {
    return new Response("Invalid OAuth state", { status: 400 });
  }

  let returnTo = "https://www.theonlypm.com/studio";
  try {
    const encoded = stateParam.split(".").slice(1).join(".");
    if (encoded) {
      returnTo = JSON.parse(atob(encoded)).returnTo || returnTo;
    }
  } catch {
    /* keep default */
  }

  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const token = await exchangeCodeForToken(code, url.origin + "/studio/oauth/callback", env);
  const user = await fetchGitHubUser(token);
  const login = (user.login || "").toLowerCase();

  if (!allowedLogins(env).includes(login)) {
    return new Response(
      `GitHub user @${user.login} is not allowed to use Studio. Ask the site admin to add your username to ALLOWED_GITHUB_USERS.`,
      { status: 403 },
    );
  }

  const sessionToken = await signSession(
    {
      token,
      login: user.login,
      name: user.name || user.login,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    env,
  );

  const headers = new Headers();
  headers.append("Location", returnTo + (returnTo.includes("?") ? "&" : "?") + "studio=1");
  headers.append(
    "Set-Cookie",
    `studio_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}`,
  );
  headers.append(
    "Set-Cookie",
    "studio_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
  );

  return new Response("Signed in. Redirecting…", { status: 302, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return corsPreflight(origin, env);
    }

    try {
      if (url.pathname === "/studio/health") {
        return json({ ok: true }, 200, origin, env);
      }

      if (url.pathname === "/studio/login") {
        return handleLogin(url, env);
      }

      if (url.pathname === "/studio/oauth/callback") {
        return handleOAuthCallbackFromRequest(url, env, request);
      }

      if (url.pathname === "/studio/me") {
        return withSession(request, env, async (session) =>
          json({ login: session.login, name: session.name }, 200, origin, env),
        );
      }

      if (url.pathname === "/studio/logout") {
        return logout(origin, env);
      }

      if (url.pathname === "/studio/propose" && request.method === "POST") {
        return withSession(request, env, async (session) =>
          handlePropose(request, session, origin, env),
        );
      }

      if (url.pathname === "/studio/apply" && request.method === "POST") {
        return withSession(request, env, async (session) =>
          handleApply(request, session, origin, env),
        );
      }

      return json({ error: "Not found" }, 404, origin, env);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return json({ error: message }, 500, origin, env);
    }
  },
};

function parseCookies(header) {
  const map = {};
  if (!header) return map;
  header.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (k) map[k] = decodeURIComponent(v.join("="));
  });
  return map;
}

function logout(origin, env) {
  const headers = {
    ...corsHeaders(origin, env),
    "Set-Cookie":
      "studio_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0",
  };
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

async function withSession(request, env, handler) {
  const origin = request.headers.get("Origin") || "";
  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const session = await verifySession(cookies.studio_session, env);
  if (!session) {
    return json({ error: "Unauthorized" }, 401, origin, env);
  }
  return handler(session);
}

async function exchangeCodeForToken(code, redirectUri, env) {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(data.error_description || data.error || "OAuth token failed");
  }
  return data.access_token;
}

async function fetchGitHubUser(token) {
  const res = await fetch("https://api.github.com/user", {
    headers: githubHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to load GitHub user");
  return res.json();
}

function githubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "pm-website-studio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function signSession(payload, env) {
  const secret = env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET");
  const body = btoa(JSON.stringify(payload));
  const sig = await hmacSha256Hex(secret, body);
  return `${body}.${sig}`;
}

async function verifySession(cookie, env) {
  if (!cookie) return null;
  const secret = env.SESSION_SECRET;
  if (!secret) return null;
  const [body, sig] = cookie.split(".");
  if (!body || !sig) return null;
  const expected = await hmacSha256Hex(secret, body);
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(atob(body));
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function signProposal(proposal, env) {
  const secret = env.SESSION_SECRET;
  const body = btoa(JSON.stringify(proposal));
  const sig = await hmacSha256Hex(secret, "proposal:" + body);
  return `${body}.${sig}`;
}

async function verifyProposal(signed, env) {
  const secret = env.SESSION_SECRET;
  const [body, sig] = signed.split(".");
  if (!body || !sig) throw new Error("Invalid proposal");
  const expected = await hmacSha256Hex(secret, "proposal:" + body);
  if (sig !== expected) throw new Error("Proposal signature mismatch");
  const proposal = JSON.parse(atob(body));
  if (proposal.exp && Date.now() > proposal.exp) {
    throw new Error("Proposal expired — generate preview again");
  }
  return proposal;
}

function validatePath(path) {
  const p = String(path || "").replace(/^\/+/, "");
  if (!p || p.includes("..")) return false;
  if (BLOCKED_PREFIXES.some((b) => p.startsWith(b))) return false;
  return ALLOWED_PREFIXES.some((prefix) => p.startsWith(prefix));
}

async function handlePropose(request, session, origin, env) {
  const form = await request.formData();
  const message = String(form.get("message") || "").trim();
  if (!message) {
    return json({ error: "Message is required" }, 400, origin, env);
  }

  const attachments = [];
  for (const [key, value] of form.entries()) {
    if (key === "message") continue;
    if (value instanceof File && value.size > 0) {
      const buf = await value.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      attachments.push({
        name: value.name,
        type: value.type || "application/octet-stream",
        base64: btoa(binary),
      });
    }
  }

  const treePaths = await listContentPaths(session.token);
  const manifest = STUDIO_MANIFEST;
  const contextFiles = await loadContextFiles(session.token, message, treePaths);

  const model =
    env.OPENROUTER_MODEL ||
    (attachments.length ? "openai/gpt-4o-mini" : "openai/gpt-4o-mini");

  const llmResult = await callOpenRouter({
    env,
    model,
    message,
    attachments,
    treePaths,
    manifest,
    contextFiles,
  });

  const files = [];
  for (const f of llmResult.files || []) {
    if (!validatePath(f.path)) {
      throw new Error(`LLM tried to edit disallowed path: ${f.path}`);
    }
    if (f.encoding === "base64") {
      files.push({
        path: f.path.replace(/^\/+/, ""),
        action: f.action || "create",
        encoding: "base64",
        content: f.content,
      });
    } else {
      const text = String(f.content ?? "");
      if (f.path.endsWith(".json")) {
        JSON.parse(text);
      }
      files.push({
        path: f.path.replace(/^\/+/, ""),
        action: f.action || "update",
        encoding: "utf-8",
        content: text,
      });
    }
  }

  if (!files.length) {
    return json(
      { error: "No file changes proposed. Try being more specific." },
      400,
      origin, env,
    );
  }

  const previews = [];
  for (const f of files) {
    let before = null;
    if (f.action !== "create") {
      before = await fetchFileContent(session.token, f.path);
    }
    previews.push({
      path: f.path,
      action: f.action,
      before: before ? truncate(before, 8000) : null,
      after:
        f.encoding === "base64"
          ? `[binary ${f.content.length} chars base64]`
          : truncate(f.content, 8000),
    });
  }

  const proposal = {
    summary: llmResult.summary || "Studio update",
    files,
    exp: Date.now() + PROPOSAL_TTL_MS,
  };

  const proposalBytes = JSON.stringify(proposal).length;
  if (proposalBytes > MAX_PROPOSAL_BYTES) {
    return json({ error: "Proposal too large; try fewer/smaller files" }, 400, origin, env);
  }

  const signedProposal = await signProposal(proposal, env);

  return json(
    {
      summary: proposal.summary,
      previews,
      signedProposal,
    },
    200,
    origin,
    env,
  );
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n… [truncated in preview]";
}

async function handleApply(request, session, origin, env) {
  const body = await request.json();
  const signedProposal = body.signedProposal;
  if (!signedProposal) {
    return json({ error: "Missing signedProposal" }, 400, origin, env);
  }

  const proposal = await verifyProposal(signedProposal, env);
  const commitMessage = `Studio: ${proposal.summary} (@${session.login})`;

  const sha = await commitMultipleFiles(session.token, proposal.files, commitMessage);

  return json(
    {
      ok: true,
      commitSha: sha,
      message: "Published to main. Site will rebuild in about 1–2 minutes.",
    },
    200,
    origin,
    env,
  );
}

async function listContentPaths(token) {
  const refRes = await fetch(
    `https://api.github.com/repos/${REPO}/git/ref/heads/${BRANCH}`,
    { headers: githubHeaders(token) },
  );
  if (!refRes.ok) throw new Error("Could not read main branch");
  const ref = await refRes.json();
  const treeRes = await fetch(
    `https://api.github.com/repos/${REPO}/git/trees/${ref.object.sha}?recursive=1`,
    { headers: githubHeaders(token) },
  );
  if (!treeRes.ok) throw new Error("Could not list repo files");
  const tree = await treeRes.json();
  return (tree.tree || [])
    .filter((t) => t.type === "blob")
    .map((t) => t.path)
    .filter((p) => validatePath(p));
}

async function fetchFileContent(token, path) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: githubHeaders(token) },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to read ${path}`);
  const data = await res.json();
  if (data.encoding === "base64") {
    return atob(data.content.replace(/\n/g, ""));
  }
  return data.content || null;
}

async function commitMultipleFiles(token, files, message) {
  const refRes = await fetch(
    `https://api.github.com/repos/${REPO}/git/ref/heads/${BRANCH}`,
    { headers: githubHeaders(token) },
  );
  if (!refRes.ok) throw new Error("Failed to read main ref");
  const ref = await refRes.json();
  const baseCommitSha = ref.object.sha;

  const commitRes = await fetch(
    `https://api.github.com/repos/${REPO}/git/commits/${baseCommitSha}`,
    { headers: githubHeaders(token) },
  );
  const baseCommit = await commitRes.json();
  const baseTreeSha = baseCommit.tree.sha;

  const treeItems = [];
  for (const f of files) {
    const blobRes = await fetch(`https://api.github.com/repos/${REPO}/git/blobs`, {
      method: "POST",
      headers: { ...githubHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({
        content: f.content,
        encoding: f.encoding === "base64" ? "base64" : "utf-8",
      }),
    });
    if (!blobRes.ok) throw new Error(`Failed to create blob for ${f.path}`);
    const blob = await blobRes.json();
    treeItems.push({
      path: f.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  const treeRes = await fetch(`https://api.github.com/repos/${REPO}/git/trees`, {
    method: "POST",
    headers: { ...githubHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems,
    }),
  });
  if (!treeRes.ok) throw new Error("Failed to create tree");
  const newTree = await treeRes.json();

  const newCommitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits`, {
    method: "POST",
    headers: { ...githubHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });
  if (!newCommitRes.ok) throw new Error("Failed to create commit");
  const newCommit = await newCommitRes.json();

  const updateRef = await fetch(
    `https://api.github.com/repos/${REPO}/git/refs/heads/${BRANCH}`,
    {
      method: "PATCH",
      headers: { ...githubHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ sha: newCommit.sha }),
    },
  );
  if (!updateRef.ok) throw new Error("Failed to update main");
  return newCommit.sha;
}

async function loadContextFiles(token, message, treePaths) {
  const lower = message.toLowerCase();
  const hints = [
    { words: ["about"], path: "content/pages/about.json" },
    { words: ["home", "homepage"], path: "content/pages/home.json" },
    { words: ["contact", "booking"], path: "content/pages/contact.json" },
    { words: ["event"], prefix: "content/events/" },
    { words: ["merch", "shop"], prefix: "content/merch/" },
    { words: ["music", "release"], prefix: "content/releases/" },
    { words: ["media", "photo"], prefix: "content/media/" },
    { words: ["dj"], path: "content/pages/pm-the-dj.json" },
    { words: ["artist"], path: "content/pages/pm-the-artist.json" },
  ];

  const selected = new Set();
  for (const hint of hints) {
    if (!hint.words.some((w) => lower.includes(w))) continue;
    if (hint.path && treePaths.includes(hint.path)) selected.add(hint.path);
    if (hint.prefix) {
      treePaths.filter((p) => p.startsWith(hint.prefix)).slice(0, 8).forEach((p) => selected.add(p));
    }
  }

  if (!selected.size && treePaths.includes("content/pages/about.json")) {
    selected.add("content/pages/about.json");
  }

  const out = [];
  for (const path of [...selected].slice(0, 10)) {
    const content = await fetchFileContent(token, path);
    if (content) {
      out.push({ path, content: truncate(content, 12000) });
    }
  }
  return out;
}

async function callOpenRouter({ env, model, message, attachments, treePaths, manifest, contextFiles }) {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY on worker");

  const relevantPaths = treePaths.slice(0, 200).join("\n");
  const system = `You are the content editor for theonlypm.com. ${manifest}

Return ONLY valid JSON (no markdown fences) with this shape:
{"summary":"short description of changes","files":[{"path":"content/...","action":"update|create","encoding":"utf-8|base64","content":"full file content"}]}

Rules:
- Include FULL file contents for every create/update (not a diff).
- For images from attachments, write to public/uploads/sensible-name.ext with encoding base64 and content = base64 data only (no data: prefix).
- Read paths from the repo list; match user intent to the right file(s).
- If the request is ambiguous, still make a reasonable scoped edit and explain in summary.

Repo content paths (sample):
${relevantPaths}

Current file contents to edit (use as base; return full updated files):
${contextFiles.map((f) => "--- " + f.path + " ---\n" + f.content).join("\n\n")}`;

  const userContent = [];
  userContent.push({ type: "text", text: message });
  for (const att of attachments) {
    if (att.type.startsWith("image/")) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${att.type};base64,${att.base64}` },
      });
    } else {
      userContent.push({
        type: "text",
        text: `Attachment ${att.name} (${att.type}) base64:\n${att.base64.slice(0, 50000)}`,
      });
    }
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://theonlypm.com/studio",
      "X-Title": "The PM Studio",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent.length === 1 ? message : userContent },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty LLM response");

  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("LLM did not return JSON");
  }
}

const STUDIO_MANIFEST = `The PM website (Yevucee/pm-website) — file-based CMS. Edit ONLY paths under content/ or public/uploads/.
content/pages/*.json — page copy. content/events/*.json — events (16:9 posters in /uploads/, date YYYY-MM-DD).
content/merch/*.json, content/media/*.json, content/releases/*.md (YAML frontmatter), content/settings/general.json.
Do NOT edit src/, scripts/, .github/. Scope text replacements carefully — do not replace every "PM" site-wide unless asked.`;
