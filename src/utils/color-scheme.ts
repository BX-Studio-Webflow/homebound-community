export interface ColorSchemeBinding {
  /** Clickable scheme buttons (each must have `dev-target="<token>-scheme"`). */
  schemeButtons: HTMLElement[];
  /** Forward image that should be swapped when a scheme button is clicked. */
  forwardImage: HTMLImageElement;
  /** Hidden scheme images keyed by scheme token (same `<token>-scheme` dev-target value). */
  schemeImagesByToken: Map<string, HTMLImageElement>;
  /** Optional visual overrides for the inline SVG circle (if your section differs). */
  visual?: ColorSchemeVisualConfig;
}

export interface ColorSchemeVisualConfig {
  activeStrokeWidth?: number;
  inactiveStrokeWidth?: number;
  activeCircleRadius?: number;
  inactiveCircleRadius?: number;
}

export interface ColorSchemeControllerConfig {
  bindings: ColorSchemeBinding[];
  activeStrokeWidth?: number; // default: 2
  inactiveStrokeWidth?: number; // default: 0.5
  activeCircleRadius?: number; // default: 21.5
  inactiveCircleRadius?: number; // default: 22.5
}

/**
 * Swaps `forwardImage` to the selected scheme and updates button state visuals.
 *
 * The caller is responsible for locating elements and creating {@link ColorSchemeBinding}s.
 */
export class ColorSchemeController {
  private hasInit = false;

  private readonly config: ColorSchemeControllerConfig;

  constructor(config: ColorSchemeControllerConfig) {
    this.config = config;
  }

  init(): void {
    if (this.hasInit) return;
    this.hasInit = true;

    this.config.bindings.forEach((binding) => {
      if (!binding.schemeButtons.length) return;

      // Ensure initial state in case markup didn't set the inner SVG attributes.
      const activeBtn = binding.schemeButtons.find((b) => b.classList.contains('is-active'));
      if (activeBtn) {
        const token = activeBtn.getAttribute('dev-target');
        if (token) this.apply(binding, token, activeBtn);
      } else {
        this.syncButtonVisuals(binding);
      }

      binding.schemeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const token = btn.getAttribute('dev-target');
          if (!token) {
            console.error('ColorSchemeController: scheme button is missing dev-target attribute.');
            return;
          }
          this.apply(binding, token, btn);
        });
      });
    });
  }

  private apply(binding: ColorSchemeBinding, token: string, activeBtn: HTMLElement): void {
    const schemeImg = binding.schemeImagesByToken.get(token);
    if (!schemeImg) {
      console.error(`ColorSchemeController: no hidden scheme image for token "${token}".`);
      return;
    }

    // Swap forward image to the chosen scheme variant.
    binding.forwardImage.src = schemeImg.src;
    if (schemeImg.srcset) binding.forwardImage.srcset = schemeImg.srcset;
    if (schemeImg.sizes) binding.forwardImage.sizes = schemeImg.sizes;
    if (schemeImg.alt) binding.forwardImage.alt = schemeImg.alt;

    this.syncButtonVisuals(binding, activeBtn);
  }

  private syncButtonVisuals(binding: ColorSchemeBinding, activeBtn?: HTMLElement): void {
    const { activeStrokeWidth, inactiveStrokeWidth, activeCircleRadius, inactiveCircleRadius } =
      this.getVisuals(binding);

    binding.schemeButtons.forEach((btn) => {
      const isActive = activeBtn ? btn === activeBtn : btn.classList.contains('is-active');
      btn.classList.toggle('is-active', isActive);

      const circle = btn.querySelector<SVGCircleElement>('circle');
      if (!circle) return;

      circle.setAttribute(
        'stroke-width',
        String(isActive ? activeStrokeWidth : inactiveStrokeWidth)
      );
      circle.setAttribute('r', String(isActive ? activeCircleRadius : inactiveCircleRadius));
    });
  }

  private getVisuals(binding: ColorSchemeBinding): Required<ColorSchemeVisualConfig> {
    return {
      activeStrokeWidth: binding.visual?.activeStrokeWidth ?? this.config.activeStrokeWidth ?? 2,
      inactiveStrokeWidth:
        binding.visual?.inactiveStrokeWidth ?? this.config.inactiveStrokeWidth ?? 0.5,
      activeCircleRadius:
        binding.visual?.activeCircleRadius ?? this.config.activeCircleRadius ?? 21.5,
      inactiveCircleRadius:
        binding.visual?.inactiveCircleRadius ?? this.config.inactiveCircleRadius ?? 22.5,
    };
  }
}
