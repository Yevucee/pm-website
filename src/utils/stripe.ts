const STRIPE_LINK_PATTERN = /^https:\/\/(buy|checkout)\.stripe\.com\//i;

export const goToStripeLink = (link?: string, fallback?: string) => {
  const target = (link || fallback || '').trim();

  if (!target) {
    return;
  }

  if (!STRIPE_LINK_PATTERN.test(target)) {
    return;
  }

  window.location.assign(target);
};
