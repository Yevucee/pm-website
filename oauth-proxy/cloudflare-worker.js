export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    if (pathname === "/auth") {
      const clientId = env.GITHUB_CLIENT_ID;
      if (!clientId) {
        return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
      }

      const provider = searchParams.get("provider");
      if (provider && provider !== "github") {
        return new Response("Invalid provider", { status: 400 });
      }

      const siteId = searchParams.get("site_id");
      const scope = searchParams.get("scope") || "repo";
      const state = searchParams.get("state") || crypto.randomUUID();
      const redirectParams = new URLSearchParams();
      if (siteId) {
        redirectParams.set("site_id", siteId);
      }
      redirectParams.set("provider", "github");
      const redirectUri = `${url.origin}/callback?${redirectParams.toString()}`;

      const authUrl = new URL("https://github.com/login/oauth/authorize");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", scope);
      authUrl.searchParams.set("state", state);

      return Response.redirect(authUrl.toString(), 302);
    }

    if (pathname === "/callback") {
      const clientId = env.GITHUB_CLIENT_ID;
      const clientSecret = env.GITHUB_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return new Response("Missing GitHub OAuth env vars", { status: 500 });
      }

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const siteId = searchParams.get("site_id");
      const provider = searchParams.get("provider");
      if (provider && provider !== "github") {
        return new Response("Invalid provider", { status: 400 });
      }

      if (!code) {
        return new Response("Missing code", { status: 400 });
      }

      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            state,
            redirect_uri: `${url.origin}/callback?${new URLSearchParams({
              ...(siteId ? { site_id: siteId } : {}),
              provider: "github",
            }).toString()}`,
          }),
        },
      );

      const tokenJson = await tokenResponse.json();
      const accessToken = tokenJson.access_token;

      if (!accessToken) {
        return new Response(
          `OAuth error: ${tokenJson.error || "unknown"}`,
          { status: 400 },
        );
      }

      const targetOrigin = siteId ? `https://${siteId}` : "*";
      const payload = {
        token: accessToken,
        access_token: accessToken,
        provider: "github",
      };
      const html = `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        if (!window.opener) {
          return;
        }
        const payload = ${JSON.stringify(payload)};
        const message = "authorization:github:success:" + JSON.stringify({ token: payload.token });
        const targetOrigin = ${JSON.stringify(targetOrigin)};
        function receiveMessage() {
          window.opener.postMessage(message, targetOrigin);
          window.removeEventListener("message", receiveMessage, false);
          window.close();
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", targetOrigin);
      })();
    </script>
    Authorizing Decap...
  </body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
