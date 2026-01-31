import general from '../../content/settings/general.json';

export interface GeneralSettings {
  artistName: string;
  tagline: string;
  bookingEmail: string;
  managementEmail: string;
  phone: string;
  instagram: string;
  twitter: string;
  spotify: string;
  appleMusic: string;
  youtube: string;
  tiktok?: string;
}

const fallback: GeneralSettings = {
  artistName: 'The PM',
  tagline: 'UK Rapper · DJ · Event Organiser',
  bookingEmail: 'theonlypm@gmail.com',
  managementEmail: 'theonlypm@gmail.com',
  phone: '+44 7700 900000',
  instagram: 'https://www.instagram.com/_thepm_',
  twitter: 'https://x.com/_thepm_',
  spotify: 'https://open.spotify.com/album/3Ym3xOwfN2rByjWBiLnNqu',
  appleMusic: 'https://music.apple.com/us/album/the-passion-mixtape/1774418927',
  youtube: 'https://www.youtube.com/@thepm',
  tiktok: 'https://www.tiktok.com/@_thepm_'
};

export const generalSettings: GeneralSettings = {
  ...fallback,
  ...(general as Partial<GeneralSettings>)
};
