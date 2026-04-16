export interface ColorSchemeBinding {
  /** Clickable scheme buttons (each must have `dev-target="<token>-scheme"`). */
  schemeButtons: HTMLElement[];
  /** Forward image that should be swapped when a scheme button is clicked. */
  forwardImage: HTMLImageElement;
  /** Hidden scheme images keyed by scheme token (same `<token>-scheme` dev-target value). */
  schemeImagesByToken: Map<string, HTMLImageElement>;
  /** Optional visual overrides for the inline SVG circle (if your section differs). */
  visual?: ColorSchemeVisualConfig;
  /** Optional context controls (e.g. interiors) that drive title/image per scheme. */
  context?: ColorSchemeContextConfig;
}

export interface ColorSchemeVisualConfig {
  activeStrokeWidth?: number;
  inactiveStrokeWidth?: number;
  activeCircleRadius?: number;
  inactiveCircleRadius?: number;
}

export interface ColorSchemeContextConfig {
  /** Context buttons (e.g. interior tabs) sharing `dev-target="<context-token>"`. */
  contextButtons: HTMLElement[];
  /** Fallback context token when no context button is active. */
  defaultContextToken?: string;
  /** Scheme to force when context changes. Falls back to first scheme button token. */
  defaultSchemeToken?: string;
  /** Whether context switch should reset to default scheme (default: true). */
  resetSchemeOnContextChange?: boolean;
  /** Optional label element to keep in sync with context + scheme. */
  titleElement?: HTMLElement;
  /** Optional title mapping by context token then scheme token. */
  titleByContextAndScheme?: Record<string, Record<string, string>>;
  /** Optional direct image URL mapping by context token then scheme token. */
  imageUrlByContextAndScheme?: Record<string, Record<string, string>>;
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

      const { context } = binding;
      if (context?.contextButtons.length) {
        const initialContextToken = this.getInitialContextToken(context);
        if (initialContextToken) this.setActiveContextToken(context, initialContextToken);

        context.contextButtons.forEach((btn) => {
          btn.addEventListener('click', () => {
            const contextToken = btn.getAttribute('dev-target');
            if (!contextToken) return;
            this.setActiveContextToken(context, contextToken);

            const shouldResetScheme = context.resetSchemeOnContextChange ?? true;
            const nextSchemeToken = shouldResetScheme
              ? this.getDefaultSchemeToken(binding)
              : (this.getActiveSchemeToken(binding) ?? this.getDefaultSchemeToken(binding));
            if (!nextSchemeToken) return;

            this.apply(binding, nextSchemeToken, contextToken);
          });
        });
      }

      const initialSchemeToken = this.getDefaultSchemeToken(binding);
      if (initialSchemeToken) {
        this.apply(binding, initialSchemeToken, this.getActiveContextToken(binding.context));
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
          this.apply(binding, token, this.getActiveContextToken(binding.context));
        });
      });
    });
  }

  private apply(binding: ColorSchemeBinding, token: string, contextToken?: string): void {
    const activeBtn = binding.schemeButtons.find((btn) => btn.getAttribute('dev-target') === token);
    if (!activeBtn) {
      console.error(`ColorSchemeController: no scheme button found for token "${token}".`);
      return;
    }

    const contextualImageUrl = contextToken
      ? binding.context?.imageUrlByContextAndScheme?.[contextToken]?.[token]
      : undefined;

    if (contextualImageUrl) {
      binding.forwardImage.src = contextualImageUrl;
      // Context-driven URLs are a single source image.
      binding.forwardImage.removeAttribute('srcset');
      binding.forwardImage.removeAttribute('sizes');
    } else {
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
    }

    if (contextToken && binding.context?.titleElement && binding.context?.titleByContextAndScheme) {
      const title = binding.context.titleByContextAndScheme[contextToken]?.[token];
      if (title) binding.context.titleElement.textContent = title;
    }

    this.syncButtonVisuals(binding, activeBtn);
  }

  private getDefaultSchemeToken(binding: ColorSchemeBinding): string | undefined {
    const contextDefault = binding.context?.defaultSchemeToken;
    if (contextDefault && this.hasSchemeButton(binding, contextDefault)) return contextDefault;

    const activeToken = this.getActiveSchemeToken(binding);
    if (activeToken) return activeToken;

    return (
      binding.schemeButtons
        .find((btn) => btn.getAttribute('dev-target'))
        ?.getAttribute('dev-target') ?? undefined
    );
  }

  private getActiveSchemeToken(binding: ColorSchemeBinding): string | undefined {
    return (
      binding.schemeButtons
        .find((btn) => btn.classList.contains('is-active'))
        ?.getAttribute('dev-target') ?? undefined
    );
  }

  private hasSchemeButton(binding: ColorSchemeBinding, token: string): boolean {
    return binding.schemeButtons.some((btn) => btn.getAttribute('dev-target') === token);
  }

  private getInitialContextToken(context: ColorSchemeContextConfig): string | undefined {
    if (
      context.defaultContextToken &&
      this.hasContextButton(context, context.defaultContextToken)
    ) {
      return context.defaultContextToken;
    }

    const activeContextToken =
      context.contextButtons
        .find((btn) => btn.classList.contains('is-active'))
        ?.getAttribute('dev-target') ?? undefined;
    if (activeContextToken) return activeContextToken;

    return (
      context.contextButtons
        .find((btn) => btn.getAttribute('dev-target'))
        ?.getAttribute('dev-target') ?? undefined
    );
  }

  private getActiveContextToken(context?: ColorSchemeContextConfig): string | undefined {
    if (!context) return undefined;
    return (
      context.contextButtons
        .find((btn) => btn.classList.contains('is-active'))
        ?.getAttribute('dev-target') ?? undefined
    );
  }

  private setActiveContextToken(context: ColorSchemeContextConfig, token: string): void {
    context.contextButtons.forEach((btn) => {
      const btnToken = btn.getAttribute('dev-target') ?? '';
      btn.classList.toggle('is-active', btnToken === token);
    });
  }

  private hasContextButton(context: ColorSchemeContextConfig, token: string): boolean {
    return context.contextButtons.some((btn) => btn.getAttribute('dev-target') === token);
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
