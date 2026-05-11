import { ALTADENA_POS1_SWATCH_DATA_URI } from '$utils/altadena-pos1-swatch-datauri';
import { type ColorSchemeVisualConfig } from '$utils/interior-color-scheme';

export type HousePlanSwatchProfile = 'altadena' | 'lakeside';

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

const ALTADENA_HOUSE_PLAN_SLUGS = new Set(['echo', 'merrick', 'chaney', 'loma', 'sycamore']);

export function isAltadenaHousePlan(slug: string): boolean {
  return ALTADENA_HOUSE_PLAN_SLUGS.has(slug);
}

export function getHousePlanSwatchProfile(slug: string): HousePlanSwatchProfile {
  return isAltadenaHousePlan(slug) ? 'altadena' : 'lakeside';
}

export function getSchemeSwatchVisual(profile: HousePlanSwatchProfile): ColorSchemeVisualConfig {
  return profile === 'altadena' ? ALTADENA_SCHEME_VISUAL : LAKESIDE_SCHEME_VISUAL;
}

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

export function applySchemeSwatchMarkup(buttons: HTMLElement[]): void {
  buttons.forEach((button, index) => {
    const token = button.getAttribute('dev-target');
    if (!token) return;

    const clipId = `hb-altadena-${token}-${index}`;
    button.innerHTML = buildAltadenaSwatchSvg(token, clipId);
  });
}
