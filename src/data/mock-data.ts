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

export const releases: Release[] = [
  {
    id: '1',
    title: 'Yee-Titi-Yee',
    type: 'single',
    releaseDate: '2024-08-15',
    artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
    spotifyUrl: 'https://open.spotify.com/album/3Ym3xOwfN2rByjWBiLnNqu',
    appleMusicUrl: 'https://music.apple.com/us/album/the-passion-mixtape/1774418927',
    youtubeUrl: '',
    tracks: ['Yee-Titi-Yee'],
    description: 'A witty and energetic Pidgin rap single blending African rhythms with classic hip-hop storytelling.'
  },
  {
    id: '2',
    title: 'Make Your Mind Dey',
    type: 'single',
    releaseDate: '2024-05-20',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    spotifyUrl: 'https://open.spotify.com/album/3jczBa1VQWciHzvtOHhiIW',
    appleMusicUrl: 'https://music.apple.com/us/album/make-your-mind-dey-feat-brenya-single/1511863176',
    youtubeUrl: 'https://play.google.com/store/music/album/The_PM_Make_Your_Mind_Dey_feat_Brenya?id=Bujmgmzk7pqbkj564hpoun456qe',
    tracks: ['Make Your Mind Dey'],
    description: 'A sharp, humorous track exploring relationships and social commentary through Pidgin lyricism.'
  }
];

const fallbackUpcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Boat Party: Thames Night Cruise',
    type: 'boat-party',
    date: '2025-02-14',
    time: '21:00',
    venue: 'MS London',
    city: 'London',
    image: 'https://images.unsplash.com/photo-1766442371714-c039f03b0947?w=1200',
    description: 'Join us for an unforgettable night cruising the Thames with the best underground sounds.',
    lineup: ['The PM', 'MC Skyline', 'Special Guest TBA'],
    ticketTiers: [
      { name: 'Early Bird', price: 25, available: false, stripeLink: PLACEHOLDER_STRIPE_LINK },
      { name: 'General Admission', price: 35, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK },
      { name: 'VIP Access', price: 55, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK }
    ]
  },
  {
    id: '2',
    title: 'Warehouse Sessions',
    type: 'club-night',
    date: '2025-02-21',
    time: '22:00',
    venue: 'Fabric',
    city: 'London',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200',
    description: 'Deep underground vibes in Londons most iconic club space.',
    lineup: ['The PM', 'Resident DJ', 'B2B Session'],
    ticketTiers: [
      { name: 'Early Bird', price: 15, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK },
      { name: 'General Admission', price: 20, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK },
      { name: 'VIP Table', price: 150, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK }
    ]
  },
  {
    id: '3',
    title: 'Manchester Underground',
    type: 'club-night',
    date: '2025-03-07',
    time: '23:00',
    venue: 'The Warehouse Project',
    city: 'Manchester',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200',
    description: 'Bringing the heat to Manchester with a night of pure energy.',
    ticketTiers: [
      { name: 'General Admission', price: 25, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK },
      { name: 'VIP Access', price: 45, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK }
    ]
  },
  {
    id: '4',
    title: 'Birmingham Bass',
    type: 'club-night',
    date: '2025-03-28',
    time: '22:30',
    venue: 'Lab11',
    city: 'Birmingham',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
    description: 'Heavy basslines and underground rhythms taking over Birminghams finest venue.',
    ticketTiers: [
      { name: 'Early Bird', price: 12, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK },
      { name: 'General Admission', price: 18, available: true, stripeLink: PLACEHOLDER_STRIPE_LINK }
    ]
  }
];

const fallbackPastEvents: Event[] = [
  {
    id: 'past-1',
    title: 'New Years Thames Party',
    type: 'boat-party',
    date: '2024-12-31',
    time: '22:00',
    venue: 'MS Thames',
    city: 'London',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
    description: 'Rang in 2025 on the Thames!',
    soldOut: true,
    ticketTiers: []
  },
  {
    id: 'past-2',
    title: 'Halloween Warehouse',
    type: 'club-night',
    date: '2024-10-31',
    time: '21:00',
    venue: 'Ministry of Sound',
    city: 'London',
    image: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=1200',
    description: 'Epic Halloween takeover',
    soldOut: true,
    ticketTiers: []
  }
];

const fallbackMerchProducts: Product[] = [
  {
    id: '1',
    name: 'The PM Tour Hoodie',
    price: 45,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'apparel',
    description: 'Premium heavyweight hoodie with official The PM branding.',
    stripeLink: PLACEHOLDER_STRIPE_LINK,
    inStock: true
  },
  {
    id: '2',
    name: 'Underground Logo Tee',
    price: 25,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'apparel',
    description: 'Soft cotton tee with the underground logo print.',
    stripeLink: PLACEHOLDER_STRIPE_LINK,
    inStock: true
  },
  {
    id: '3',
    name: 'Thames Party Cap',
    price: 20,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    sizes: ['One Size'],
    category: 'accessories',
    description: 'Classic cap with embroidered branding.',
    stripeLink: PLACEHOLDER_STRIPE_LINK,
    inStock: true
  },
  {
    id: '4',
    name: 'Bass Head Beanie',
    price: 18,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800',
    sizes: ['One Size'],
    category: 'accessories',
    description: 'Warm beanie for winter gigs and late nights.',
    stripeLink: PLACEHOLDER_STRIPE_LINK,
    inStock: true
  },
  {
    id: '5',
    name: 'Limited Edition Long Sleeve',
    price: 35,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'apparel',
    description: 'Limited long sleeve featuring exclusive artwork.',
    stripeLink: PLACEHOLDER_STRIPE_LINK,
    inStock: true
  },
  {
    id: '6',
    name: 'The PM Tote Bag',
    price: 15,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
    sizes: ['One Size'],
    category: 'accessories',
    description: 'Durable tote for records, merch, and essentials.',
    stripeLink: PLACEHOLDER_STRIPE_LINK,
    inStock: true
  }
];

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

const fallbackEvents = [...fallbackUpcomingEvents, ...fallbackPastEvents];
const eventSource = cmsEvents.length > 0 ? cmsEvents : fallbackEvents;
const { upcoming, past } = splitEvents(eventSource);

export const upcomingEvents = upcoming;
export const pastEvents = past;
export const merchProducts = cmsMerchProducts.length > 0 ? cmsMerchProducts : fallbackMerchProducts;
