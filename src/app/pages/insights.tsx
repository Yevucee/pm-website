import { useEffect, useState } from 'react';
import { ExternalLink, Lock, LogOut, BarChart3, Mail, LineChart } from 'lucide-react';
import { Button } from '@/app/components/button';
import {
  getLookerStudioEmbedUrl,
  getMailingListSheetEmbedUrl,
  getStatsAccessKey,
  hasStatsSession,
  isStatsDashboardConfigured,
  lockStatsSession,
  unlockStatsSession,
} from '@/config/stats-dashboard';

const GA4_PROPERTY_HINT = 'https://analytics.google.com/';
const SEARCH_CONSOLE_URL = 'https://search.google.com/search-console';

function useNoIndex() {
  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]');
    const previous = existing?.getAttribute('content') ?? '';
    let created = false;
    let meta = existing;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
      created = true;
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (created && meta?.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta) {
        meta.setAttribute('content', previous || 'index, follow');
      }
    };
  }, []);
}

function EmbedPanel({
  title,
  icon: Icon,
  embedUrl,
  emptyHint,
  minHeight = '32rem',
}: {
  title: string;
  icon: typeof BarChart3;
  embedUrl: string;
  emptyHint: string;
  minHeight?: string;
}) {
  if (!embedUrl) {
    return (
      <section className="rounded-xl border border-border bg-surface/40 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-5 w-5 text-accent" />
          <h2 className="font-heading text-xl">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{emptyHint}</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/80">
        <Icon className="h-5 w-5 text-accent" />
        <h2 className="font-heading text-lg">{title}</h2>
      </div>
      <iframe
        title={title}
        src={embedUrl}
        className="w-full border-0 bg-background"
        style={{ minHeight }}
        loading="lazy"
        allowFullScreen
      />
    </section>
  );
}

export function InsightsPage() {
  useNoIndex();
  const [unlocked, setUnlocked] = useState(hasStatsSession);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const configured = isStatsDashboardConfigured();
  const lookerUrl = getLookerStudioEmbedUrl();
  const sheetUrl = getMailingListSheetEmbedUrl();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (unlockStatsSession(password.trim())) {
      setUnlocked(true);
      setPassword('');
    } else {
      setError('Incorrect access key.');
    }
  };

  if (!configured) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-4">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto" />
          <h1 className="font-heading text-3xl">Insights not configured</h1>
          <p className="text-muted-foreground text-sm">
            Set GitHub secret <code className="text-accent">VITE_STATS_ACCESS_KEY</code> (min 8
            characters) and redeploy. Optional:{' '}
            <code className="text-accent">VITE_LOOKER_STUDIO_EMBED_URL</code>,{' '}
            <code className="text-accent">VITE_STATS_SHEET_EMBED_URL</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-surface p-8"
        >
          <div className="text-center space-y-2">
            <Lock className="h-9 w-9 text-accent mx-auto" />
            <h1 className="font-heading text-2xl">The PM · Insights</h1>
            <p className="text-sm text-muted-foreground">Private stats — not linked from the public site.</p>
          </div>
          <div>
            <label htmlFor="stats-key" className="block font-heading text-sm mb-2">
              Access key
            </label>
            <input
              id="stats-key"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none"
              placeholder="Enter access key"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" variant="primary" className="w-full">
            Unlock dashboard
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl">The PM · Insights</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Private dashboard · bookmark this URL · not in site navigation
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              lockStatsSession();
              setUnlocked(false);
            }}
          >
            <LogOut className="h-4 w-4" />
            Lock
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a
            href={GA4_PROPERTY_HINT}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-4 py-3 hover:border-accent transition-colors"
          >
            <LineChart className="h-5 w-5 text-accent shrink-0" />
            <span className="text-sm font-medium">Google Analytics 4</span>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
          <a
            href={SEARCH_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-4 py-3 hover:border-accent transition-colors"
          >
            <BarChart3 className="h-5 w-5 text-accent shrink-0" />
            <span className="text-sm font-medium">Search Console</span>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
          <a
            href="https://theonlypm.com/contact#mailing-list"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-4 py-3 hover:border-accent transition-colors"
          >
            <Mail className="h-5 w-5 text-accent shrink-0" />
            <span className="text-sm font-medium">Mailing list form</span>
            <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
          </a>
        </div>

        <EmbedPanel
          title="Site traffic (Looker Studio → GA4)"
          icon={LineChart}
          embedUrl={lookerUrl}
          minHeight="42rem"
          emptyHint="Connect GA4 to Looker Studio (free): lookerstudio.google.com → Create → Google Analytics → pick “The PM” property → Report → Share → Embed → copy the embed URL into GitHub secret VITE_LOOKER_STUDIO_EMBED_URL and redeploy."
        />

        <EmbedPanel
          title="Mailing list & form submissions (Google Sheet)"
          icon={Mail}
          embedUrl={sheetUrl}
          minHeight="28rem"
          emptyHint="In your submissions Google Sheet: File → Share → Publish to web → Embed → copy the iframe src into GitHub secret VITE_STATS_SHEET_EMBED_URL and redeploy."
        />
      </div>
    </div>
  );
}
