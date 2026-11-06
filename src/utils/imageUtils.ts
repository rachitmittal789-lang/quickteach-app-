/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// High-quality, verified public Unsplash educator portraits with instant CDN loading
export const EDUCATOR_PORTRAITS = {
  priyaSharma:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  rahulVerma:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  ananyaDas:
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
  vikramSingh:
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  kavitaSaxena:
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
  rajeshwarKulkarni:
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
  arvindSwaminathan:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
  knMurthy:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  shaliniKapoor:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
  arjunBhasin:
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  natashaMehra:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  rohanKapoor:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  alokSen:
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  rakeshRanjan:
    'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=600&q=80',
  sangeetaNayak:
    'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=600&q=80',
  heroTutoringSession:
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
  defaultFallback:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
};

/**
 * Normalizes any image URL (including legacy /src/assets/images paths stored in localStorage)
 * to a working, high-quality public CDN URL.
 */
export function sanitizeImageUrl(url?: string, name?: string): string {
  if (!url) {
    return EDUCATOR_PORTRAITS.defaultFallback;
  }

  // Already a valid public http(s) URL
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url;
  }

  const normalized = url.toLowerCase();
  const nameNormalized = (name || '').toLowerCase();

  // Match by path or name
  if (normalized.includes('priya') || nameNormalized.includes('priya')) {
    return EDUCATOR_PORTRAITS.priyaSharma;
  }
  if (normalized.includes('rahul') || nameNormalized.includes('rahul')) {
    return EDUCATOR_PORTRAITS.rahulVerma;
  }
  if (normalized.includes('ananya') || nameNormalized.includes('ananya')) {
    return EDUCATOR_PORTRAITS.ananyaDas;
  }
  if (normalized.includes('vikram') || nameNormalized.includes('vikram')) {
    return EDUCATOR_PORTRAITS.vikramSingh;
  }
  if (normalized.includes('kavita') || nameNormalized.includes('kavita') || nameNormalized.includes('sunita')) {
    return EDUCATOR_PORTRAITS.kavitaSaxena;
  }
  if (normalized.includes('hero')) {
    return EDUCATOR_PORTRAITS.heroTutoringSession;
  }
  if (nameNormalized.includes('murthy')) {
    return EDUCATOR_PORTRAITS.knMurthy;
  }
  if (nameNormalized.includes('shalini')) {
    return EDUCATOR_PORTRAITS.shaliniKapoor;
  }
  if (nameNormalized.includes('arjun')) {
    return EDUCATOR_PORTRAITS.arjunBhasin;
  }
  if (nameNormalized.includes('natasha')) {
    return EDUCATOR_PORTRAITS.natashaMehra;
  }
  if (nameNormalized.includes('rohan')) {
    return EDUCATOR_PORTRAITS.rohanKapoor;
  }
  if (nameNormalized.includes('alok')) {
    return EDUCATOR_PORTRAITS.alokSen;
  }
  if (nameNormalized.includes('rakesh')) {
    return EDUCATOR_PORTRAITS.rakeshRanjan;
  }
  if (nameNormalized.includes('sangeeta')) {
    return EDUCATOR_PORTRAITS.sangeetaNayak;
  }
  if (nameNormalized.includes('swaminathan')) {
    return EDUCATOR_PORTRAITS.arvindSwaminathan;
  }
  if (nameNormalized.includes('kulkarni')) {
    return EDUCATOR_PORTRAITS.rajeshwarKulkarni;
  }

  // Default fallback
  return EDUCATOR_PORTRAITS.defaultFallback;
}

/**
 * Handle img onError event cleanly without infinite loops
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = EDUCATOR_PORTRAITS.defaultFallback
) {
  const target = e.currentTarget;
  if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true';
    target.src = fallback;
  }
}
