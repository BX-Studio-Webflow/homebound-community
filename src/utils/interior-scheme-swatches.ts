import { ALTADENA_POS1_SWATCH_DATA_URI } from '$utils/altadena-pos1-swatch-datauri';
import { type ColorSchemeVisualConfig } from '$utils/interior-color-scheme';
import { PALISADE_SWATCH_SPANISH_DATA_URI } from '$utils/palisade-swatch-datauris';
export type HousePlanSwatchProfile = 'altadena' | 'lakeside' | 'palisade';

const ALTADENA_SCHEME_FILLS: Record<string, string> = {
  'pos-2': '#8C9BA8',
  'pos-3': '#7C6546',
  'pos-4': '#45301F',
};

const LAKESIDE_SCHEME_VISUAL: ColorSchemeVisualConfig = {
  activeStrokeWidth: 2,
  inactiveStrokeWidth: 0.5,
  activeCircleRadius: 21.5,
  inactiveCircleRadius: 22.5,
};

const ALTADENA_SCHEME_VISUAL: ColorSchemeVisualConfig = {
  activeStrokeWidth: 2,
  inactiveStrokeWidth: 0.5,
  activeCircleRadius: 21.5,
  inactiveCircleRadius: 22.25,
};

const PALISADE_SCHEME_VISUAL: ColorSchemeVisualConfig = {
  activeStrokeWidth: 2,
  inactiveStrokeWidth: 0.5,
  activeCircleRadius: 21.5,
  inactiveCircleRadius: 22.5,
};

const ALTADENA_HOUSE_PLAN_SLUGS = new Set(['echo', 'merrick', 'chaney', 'loma', 'sycamore']);
const PALISADE_HOUSE_PLAN_SLUGS = new Set([
  'elm',
  'glenview',
  'vista',
  'willow',
  'ambrose',
  'alder',
]);

export const PALISADE_SCHEME_TOKENS = ['pos-1', 'pos-2', 'pos-3'] as const;
export const FULL_SCHEME_TOKENS = ['pos-1', 'pos-2', 'pos-3', 'pos-4'] as const;

export function isAltadenaHousePlan(slug: string): boolean {
  return ALTADENA_HOUSE_PLAN_SLUGS.has(slug);
}

export function isPalisadeHousePlan(slug: string): boolean {
  return PALISADE_HOUSE_PLAN_SLUGS.has(slug);
}

export function getSchemeTokensForHousePlan(
  slug: string
): readonly (typeof FULL_SCHEME_TOKENS)[number][] {
  if (isPalisadeHousePlan(slug)) return PALISADE_SCHEME_TOKENS;
  return FULL_SCHEME_TOKENS;
}

export function getHousePlanSwatchProfile(slug: string): HousePlanSwatchProfile {
  if (isAltadenaHousePlan(slug)) return 'altadena';
  if (isPalisadeHousePlan(slug)) return 'palisade';
  return 'lakeside';
}

export function getSchemeSwatchVisual(profile: HousePlanSwatchProfile): ColorSchemeVisualConfig {
  if (profile === 'altadena') return ALTADENA_SCHEME_VISUAL;
  if (profile === 'palisade') return PALISADE_SCHEME_VISUAL;
  return LAKESIDE_SCHEME_VISUAL;
}

type PalisadePackageKey =
  | 'modern'
  | 'coastalCottage'
  | 'spanish'
  | 'transitionalOrganic'
  | 'pacificContemporary';

/** Figma node 1:779 — solid swatch fills from design spec. */
const PALISADE_SWATCH_FILLS: Record<Exclude<PalisadePackageKey, 'spanish'>, string> = {
  modern: '#EAE8E0',
  coastalCottage: '#9F8873',
  transitionalOrganic: '#DDD8CC',
  pacificContemporary: '#ABAAA6',
};

/** Per-plan pos token → package from each plan's Explore Interiors Assets legend. */
const PALISADE_PACKAGE_BY_SLUG_AND_POS: Record<
  string,
  Partial<Record<(typeof PALISADE_SCHEME_TOKENS)[number], PalisadePackageKey>>
> = {
  elm: {
    'pos-1': 'transitionalOrganic',
    'pos-2': 'coastalCottage',
    'pos-3': 'pacificContemporary',
  },
  glenview: {
    'pos-1': 'transitionalOrganic',
    'pos-2': 'coastalCottage',
    'pos-3': 'pacificContemporary',
  },
  vista: {
    'pos-1': 'transitionalOrganic',
    'pos-2': 'coastalCottage',
    'pos-3': 'pacificContemporary',
  },
  willow: {
    'pos-1': 'spanish',
    'pos-2': 'coastalCottage',
    'pos-3': 'pacificContemporary',
  },
  alder: {
    'pos-1': 'spanish',
    'pos-2': 'coastalCottage',
    'pos-3': 'pacificContemporary',
  },
  ambrose: {
    'pos-1': 'modern',
    'pos-2': 'coastalCottage',
    'pos-3': 'pacificContemporary',
  },
};

function buildAltadenaPatternSwatchSvg(clipId: string): string {
  return `<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="${clipId}">
      <circle cx="22.5" cy="22.5" r="22.25"></circle>
    </clipPath>
  </defs>
  <image href="${ALTADENA_POS1_SWATCH_DATA_URI}" x="0" y="0" width="45" height="45" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"></image>
  <circle cx="22.5" cy="22.5" r="22.25" fill="none" stroke="black" stroke-width="0.5"></circle>
</svg>`;
}

function buildAltadenaSolidSwatchSvg(fill: string): string {
  return `<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="22.5" cy="22.5" r="22.25" fill="${fill}" stroke="black" stroke-width="0.5"></circle>
</svg>`;
}

function buildAltadenaSwatchSvg(token: string, clipId: string): string {
  if (token === 'pos-1') return buildAltadenaPatternSwatchSvg(clipId);

  const fill = ALTADENA_SCHEME_FILLS[token];
  if (!fill) return buildAltadenaSolidSwatchSvg('#8C9BA8');

  return buildAltadenaSolidSwatchSvg(fill);
}

function buildPalisadeSolidSwatchSvg(fill: string): string {
  return `<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="22.5" cy="22.5" r="22.25" transform="rotate(90 22.5 22.5)" fill="${fill}" stroke="black" stroke-width="0.5"></circle>
</svg>`;
}

function buildPalisadePatternSwatchSvg(dataUri: string, clipId: string): string {
  return `<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="${clipId}">
      <circle cx="22.5" cy="22.5" r="22.25"></circle>
    </clipPath>
  </defs>
  <image href="${dataUri}" x="0" y="0" width="45" height="45" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"></image>
  <circle cx="22.5" cy="22.5" r="22.25" fill="none" stroke="black" stroke-width="0.5"></circle>
</svg>`;
}

function buildPalisadeSwatchSvg(packageKey: PalisadePackageKey, clipId: string): string {
  if (packageKey === 'spanish') {
    return buildPalisadePatternSwatchSvg(PALISADE_SWATCH_SPANISH_DATA_URI, clipId);
  }

  return buildPalisadeSolidSwatchSvg(PALISADE_SWATCH_FILLS[packageKey]);
}

export function applyPalisadeSchemeSwatchMarkup(slug: string, buttons: HTMLElement[]): void {
  const packageByPos = PALISADE_PACKAGE_BY_SLUG_AND_POS[slug];
  if (!packageByPos) return;

  buttons.forEach((button, index) => {
    const token = button.getAttribute('dev-target') as
      | (typeof PALISADE_SCHEME_TOKENS)[number]
      | null;
    if (!token) return;

    const packageKey = packageByPos[token];
    if (!packageKey) return;

    const clipId = `hb-palisade-${slug}-${token}-${index}`;
    button.innerHTML = buildPalisadeSwatchSvg(packageKey, clipId);
  });
}

export function applySchemeSwatchMarkup(buttons: HTMLElement[]): void {
  buttons.forEach((button, index) => {
    const token = button.getAttribute('dev-target');
    if (!token) return;

    const clipId = `hb-altadena-${token}-${index}`;
    button.innerHTML = buildAltadenaSwatchSvg(token, clipId);
  });
}
