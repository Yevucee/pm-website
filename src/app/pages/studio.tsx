import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/app/components/button';
import {
  getStudioApiUrl,
  isStudioConfigured,
  studioLoginUrl,
} from '@/config/studio';
import { ExternalLink, Loader2, LogOut, Sparkles, Upload } from 'lucide-react';

type PreviewItem = {
  path: string;
  action: string;
  before: string | null;
  after: string;
};

type MeResponse = { login: string; name: string };

export function StudioPage() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState('');
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [signedProposal, setSignedProposal] = useState('');
  const [busy, setBusy] = useState<'idle' | 'propose' | 'apply'>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const api = getStudioApiUrl();
  const configured = isStudioConfigured();

  useEffect(() => {
    document.title = 'Studio · The PM';
    const meta = document.querySelector('meta[name="robots"]');
    const prev = meta?.getAttribute('content') ?? '';
    if (!meta) {
      const m = document.createElement('meta');
      m.setAttribute('name', 'robots');
      m.setAttribute('content', 'noindex, nofollow');
      document.head.appendChild(m);
    } else {
      meta.setAttribute('content', 'noindex, nofollow');
    }
    return () => {
      if (meta) meta.setAttribute('content', prev || 'index, follow');
    };
  }, []);

  const apiFetch = useCallback(
    async (path: string, init?: RequestInit) => {
      const res = await fetch(`${api}${path}`, {
        ...init,
        credentials: 'include',
      });
      const text = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text.slice(0, 200) || `Request failed (${res.status})`);
      }
      if (!res.ok) {
        throw new Error(String(data.error || `Request failed (${res.status})`));
      }
      return data;
    },
    [api]
  );

  const refreshMe = useCallback(async () => {
    if (!configured) {
      setAuthLoading(false);
      return;
    }
    setAuthLoading(true);
    setError('');
    try {
      const data = (await apiFetch('/studio/me')) as MeResponse;
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, [apiFetch, configured]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const onLogout = async () => {
    try {
      await apiFetch('/studio/logout');
    } catch {
      /* ignore */
    }
    setUser(null);
    setPreviews([]);
    setSignedProposal('');
  };

  const onPropose = async () => {
    setError('');
    setSuccess('');
    setPreviews([]);
    setSignedProposal('');
    setSummary('');
    if (!message.trim()) {
      setError('Describe what you want to change.');
      return;
    }
    setBusy('propose');
    try {
      const form = new FormData();
      form.set('message', message.trim());
      files.forEach((f, i) => form.append(`file${i}`, f));
      const data = await apiFetch('/studio/propose', { method: 'POST', body: form });
      setSummary(String(data.summary || ''));
      setPreviews((data.previews as PreviewItem[]) || []);
      setSignedProposal(String(data.signedProposal || ''));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview failed');
    } finally {
      setBusy('idle');
    }
  };

  const onApply = async () => {
    if (!signedProposal) return;
    setError('');
    setSuccess('');
    setBusy('apply');
    try {
      const data = await apiFetch('/studio/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signedProposal }),
      });
      setSuccess(String(data.message || 'Published.'));
      setPreviews([]);
      setSignedProposal('');
      setMessage('');
      setFiles([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setBusy('idle');
    }
  };

  if (!configured) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-3">
          <Sparkles className="h-10 w-10 text-muted-foreground mx-auto" />
          <h1 className="font-heading text-3xl">Studio not configured</h1>
          <p className="text-sm text-muted-foreground">
            Set GitHub secret <code className="text-accent">VITE_STUDIO_API_URL</code> to your
            Cloudflare Worker URL and redeploy. See <code className="text-accent">content-agent/README.md</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-accent" />
              The PM · Studio
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Describe changes in plain English · preview · publish to live site
            </p>
          </div>
          {user && (
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Sign out ({user.login})
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {authLoading ? (
          <p className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking sign-in…
          </p>
        ) : !user ? (
          <div className="rounded-xl border border-border bg-surface p-8 space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              Sign in with GitHub. Only approved accounts can edit the site.
            </p>
            <a
              href={studioLoginUrl(window.location.href)}
              className="inline-flex items-center justify-center font-heading tracking-wide uppercase transition-all duration-200 px-6 py-3 rounded-lg bg-accent text-black hover:brightness-110"
            >
              Sign in with GitHub
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <label htmlFor="studio-message" className="block font-heading text-sm">
                What should change?
              </label>
              <textarea
                id="studio-message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='e.g. On the about page, change the hero title to "About Leslie". Or: Add a new club night event on 15 March 2027 at Brixton Jamm — tickets coming soon. (Attach a flyer if you have one.)'
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none"
              />
              <div>
                <label className="block font-heading text-sm mb-2">Attachments (optional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="text-sm text-muted-foreground"
                />
                {files.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    {files.map((f) => f.name).join(', ')}
                  </p>
                )}
              </div>
              {error && <p className="text-sm text-error">{error}</p>}
              {success && <p className="text-sm text-accent">{success}</p>}
              <Button
                type="button"
                variant="primary"
                className="w-full sm:w-auto gap-2"
                disabled={busy !== 'idle'}
                onClick={onPropose}
              >
                {busy === 'propose' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate preview
              </Button>
            </div>

            {summary && previews.length > 0 && (
              <div className="space-y-4 rounded-xl border border-border bg-surface/40 p-6">
                <h2 className="font-heading text-xl">Preview</h2>
                <p className="text-sm text-foreground/90">{summary}</p>
                <ul className="space-y-4">
                  {previews.map((p) => (
                    <li key={p.path} className="border border-border rounded-lg p-4 text-sm">
                      <p className="font-mono text-accent mb-2">
                        {p.action} · {p.path}
                      </p>
                      {p.before && (
                        <details className="mb-2">
                          <summary className="cursor-pointer text-muted-foreground">Before</summary>
                          <pre className="mt-2 whitespace-pre-wrap text-xs opacity-80 max-h-48 overflow-auto">
                            {p.before}
                          </pre>
                        </details>
                      )}
                      <details open>
                        <summary className="cursor-pointer text-muted-foreground">After</summary>
                        <pre className="mt-2 whitespace-pre-wrap text-xs max-h-64 overflow-auto">
                          {p.after}
                        </pre>
                      </details>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">
                  Publishing commits directly to <strong>main</strong> and triggers a rebuild (~1–2
                  min).
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full gap-2"
                  disabled={busy !== 'idle' || !signedProposal}
                  onClick={onApply}
                >
                  {busy === 'apply' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Publish to live site
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Legacy form editor still at{' '}
              <a href="/admin" className="text-accent hover:underline">
                /admin
              </a>{' '}
              (Decap CMS) — Studio replaces this over time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
