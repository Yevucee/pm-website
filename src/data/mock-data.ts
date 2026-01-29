export interface Release {
  id: string;
  title: string;
  type: 'single' | 'ep' | 'album';
  releaseDate: string;
  artwork: string;
  spotifyUrl: string;
  appleMusicUrl: string;
  youtubeUrl: string;
  tracks?: string[];
  description?: string;
}

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
}

export const releases: Release[] = [
  {
    id: '1',
    title: 'Yee-Titi-Yee',
    type: 'single',
    releaseDate: '2024-08-15',
    artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
    spotifyUrl: '#',
    appleMusicUrl: '#',
    youtubeUrl: '#',
    tracks: ['Yee-Titi-Yee'],
    description: 'A witty and energetic Pidgin rap single blending African rhythms with classic hip-hop storytelling.'
  },
  {
    id: '2',
    title: 'Make Your Mind Dey',
    type: 'single',
    releaseDate: '2024-05-20',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    spotifyUrl: '#',
    appleMusicUrl: '#',
    youtubeUrl: '#',
    tracks: ['Make Your Mind Dey'],
    description: 'A sharp, humorous track exploring relationships and social commentary through Pidgin lyricism.'
  }
];

export const upcomingEvents: Event[] = [
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
      { name: 'Early Bird', price: 25, available: false },
      { name: 'General Admission', price: 35, available: true },
      { name: 'VIP Access', price: 55, available: true }
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
      { name: 'Early Bird', price: 15, available: true },
      { name: 'General Admission', price: 20, available: true },
      { name: 'VIP Table', price: 150, available: true }
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
      { name: 'General Admission', price: 25, available: true },
      { name: 'VIP Access', price: 45, available: true }
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
      { name: 'Early Bird', price: 12, available: true },
      { name: 'General Admission', price: 18, available: true }
    ]
  }
];

export const pastEvents: Event[] = [
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

export const merchProducts: Product[] = [
  {
    id: '1',
    name: 'The PM Tour Hoodie',
    price: 45,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'apparel'
  },
  {
    id: '2',
    name: 'Underground Logo Tee',
    price: 25,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'apparel'
  },
  {
    id: '3',
    name: 'Thames Party Cap',
    price: 20,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    sizes: ['One Size'],
    category: 'accessories'
  },
  {
    id: '4',
    name: 'Bass Head Beanie',
    price: 18,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800',
    sizes: ['One Size'],
    category: 'accessories'
  },
  {
    id: '5',
    name: 'Limited Edition Long Sleeve',
    price: 35,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'apparel'
  },
  {
    id: '6',
    name: 'The PM Tote Bag',
    price: 15,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
    sizes: ['One Size'],
    category: 'accessories'
  }
];
