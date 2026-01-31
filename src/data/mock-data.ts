export interface Event {
  id: string;
  title: string;
  type: 'boat-party' | 'club-night' | 'festival';
  date: string;
  time: string;
  venue: string;
  city: string;
  image: string;
  description: string;
  comingSoon?: boolean;
  lineup?: string[];
  ticketTiers: {
    name: string;
    price: number;
    available: boolean;
    stripeLink?: string;
  }[];
  soldOut?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  category: 'apparel' | 'accessories';
  description?: string;
  stripeLink?: string;
  inStock?: boolean;
}

interface EventContent {
  title?: string;
  type?: string;
  date?: string;
  time?: string;
  venue?: string;
  city?: string;
  image?: string;
  description?: string;
  comingSoon?: boolean;
  lineup?: string[];
  ticketTiers?: {
    name?: string;
    price?: number;
    stripeLink?: string;
    available?: boolean;
  }[];
  soldOut?: boolean;
}

interface ProductContent {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  sizes?: string[];
  category?: string;
  stripeLink?: string;
  inStock?: boolean;
}

const PLACEHOLDER_STRIPE_LINK = 'https://buy.stripe.com/fZu14ob3Z7HGeUAeWj5c400';
const eventModules = import.meta.glob<EventContent>('../../content/events/*.json', {
  eager: true,
  import: 'default'
});
const merchModules = import.meta.glob<ProductContent>('../../content/merch/*.json', {
  eager: true,
  import: 'default'
});

const normalizeStripeLink = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : PLACEHOLDER_STRIPE_LINK;
};

const resolvePublicAsset = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  const basePrefix = normalizedBase.replace(/^\/|\/$/g, '');
  const normalizedWithSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (basePrefix && normalizedWithSlash.startsWith(`/${basePrefix}/`)) {
    return `${window.location.origin}${normalizedWithSlash}`;
  }

  return `${window.location.origin}${normalizedBase}${normalizedPath}`;
};

const normalizeEventType = (value?: string): Event['type'] => {
  if (value === 'boat-party' || value === 'festival') {
    return value;
  }
  return 'club-night';
};

const normalizeCategory = (value?: string): Product['category'] => {
  if (value === 'accessories') {
    return 'accessories';
  }
  return 'apparel';
};

const parseEvent = (path: string, data: EventContent): Event | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const id = path.split('/').pop()?.replace(/\.json$/, '') || '';
  const title = data.title?.trim() || '';
  const date = data.date?.trim() || '';
  const time = data.time?.trim() || '';
  const venue = data.venue?.trim() || '';
  const city = data.city?.trim() || '';
  const image = resolvePublicAsset(data.image);
  const description = data.description?.trim() || '';
  const ticketTiers = Array.isArray(data.ticketTiers)
    ? data.ticketTiers
        .map((tier) => ({
          name: tier.name?.trim() || '',
          price: typeof tier.price === 'number' ? tier.price : 0,
          available: tier.available !== false,
          stripeLink: normalizeStripeLink(tier.stripeLink)
        }))
        .filter((tier) => tier.name)
    : [];

  if (!id || !title || !date || !time || !venue || !city || !image || !description) {
    return null;
  }

  return {
    id,
    title,
    type: normalizeEventType(data.type),
    date,
    time,
    venue,
    city,
    image,
    description,
    comingSoon: data.comingSoon,
    lineup: Array.isArray(data.lineup) ? data.lineup : undefined,
    ticketTiers,
    soldOut: data.soldOut
  };
};

const parseProduct = (path: string, data: ProductContent): Product | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const id = path.split('/').pop()?.replace(/\.json$/, '') || '';
  const name = data.name?.trim() || '';
  const image = resolvePublicAsset(data.image);
  const sizes = Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['One Size'];

  if (!id || !name || !image) {
    return null;
  }

  return {
    id,
    name,
    description: data.description?.trim() || undefined,
    price: typeof data.price === 'number' ? data.price : 0,
    image,
    sizes,
    category: normalizeCategory(data.category),
    stripeLink: normalizeStripeLink(data.stripeLink),
    inStock: data.inStock
  };
};

const cmsEvents = Object.entries(eventModules)
  .map(([path, data]) => parseEvent(path, data))
  .filter((event): event is Event => Boolean(event));

const cmsMerchProducts = Object.entries(merchModules)
  .map(([path, data]) => parseProduct(path, data))
  .filter((product): product is Product => Boolean(product));


const isPastEvent = (dateString: string) => {
  const eventDate = new Date(dateString);
  if (Number.isNaN(eventDate.getTime())) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

const splitEvents = (events: Event[]) => {
  const upcoming: Event[] = [];
  const past: Event[] = [];

  events.forEach((event) => {
    if (isPastEvent(event.date)) {
      past.push(event);
    } else {
      upcoming.push(event);
    }
  });

  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { upcoming, past };
};

const { upcoming, past } = splitEvents(cmsEvents);

export const upcomingEvents = upcoming;
export const pastEvents = past;
export const merchProducts = cmsMerchProducts;
