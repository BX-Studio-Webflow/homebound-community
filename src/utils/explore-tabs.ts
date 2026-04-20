/**
 * Explore Plans / Available Homes tab controller.
 *
 * Switches between tab panels when the header triggers are clicked.
 * Uses dev-target attributes to wire triggers to their corresponding panels.
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---------|-----------|-------|
 * | Tab header wrapper | `dev-target` | `explore-tab-header` |
 * | Tab body wrapper | `dev-target` | `explore-tab-body` |
 * | "Explore Plans" trigger | `dev-target` | `explore-plans-trigger` |
 * | "Available Homes" trigger | `dev-target` | `explore-homes-trigger` |
 * | Explore Plans panel | `dev-target` | `explore-plans-tab` |
 * | Available Homes panel | `dev-target` | `explore-homes-tab` |
 *
 * **CSS**
 * - Triggers: add `is-active` for the active tab (style in your CSS)
 * - Panels: non-active panels get the `hide` class
 *
 * @example
 * ```ts
 * const exploreTabs = new ExploreTabsController();
 * exploreTabs.init();
 * ```
 */

const DEFAULT_TRIGGER_TO_PANEL: Record<string, string> = {
  'explore-plans-trigger': 'explore-plans-tab',
  'explore-homes-trigger': 'explore-homes-tab',
};

interface ExploreTabsOptions {
  /**
   * Maps each trigger's `dev-target` value to the `dev-target` value of the
   * panel it should reveal. Defaults to the standard explore-plans /
   * explore-homes pair.
   */
  triggerToPanel?: Record<string, string>;
  isHousePlansGallery?: boolean;
  firstTabSelector?: string;
  secondTabSelector?: string;
}

export class ExploreTabsController {
  private activeTrigger: string | null = null;
  private readonly options: ExploreTabsOptions;
  private readonly triggerToPanel: Record<string, string>;

  constructor(options: ExploreTabsOptions = {}) {
    this.options = options;
    this.triggerToPanel = options.triggerToPanel ?? DEFAULT_TRIGGER_TO_PANEL;
  }

  /**
   * Initialises the controller: wires tab triggers to panels.
   * Must be called after the DOM is ready (e.g. inside `window.Webflow.push`).
   */
  init(): void {
    const header = document.querySelector<HTMLElement>('[dev-target="explore-tab-header"]');
    const body = document.querySelector<HTMLElement>('[dev-target="explore-tab-body"]');

    if (!header) {
      console.error('ExploreTabsController: No [dev-target="explore-tab-header"] found.');
      return;
    }

    if (!body) {
      console.error('ExploreTabsController: No [dev-target="explore-tab-body"] found.');
      return;
    }

    Object.entries(this.triggerToPanel).forEach(([triggerTarget, panelTarget]) => {
      const trigger = document.querySelector<HTMLElement>(`[dev-target="${triggerTarget}"]`);
      const panel = document.querySelector<HTMLElement>(`[dev-target="${panelTarget}"]`);

      if (!trigger) {
        console.error(`ExploreTabsController: No [dev-target="${triggerTarget}"] found.`);
        return;
      }

      if (!panel) {
        console.error(`ExploreTabsController: No [dev-target="${panelTarget}"] found.`);
        return;
      }

      trigger.addEventListener('click', () => this.activate(triggerTarget));
    });

    // Set initial state from the first trigger already marked is-active, or
    // fall back to the first entry in the map.
    const triggerKeys = Object.keys(this.triggerToPanel);
    const initialTrigger = triggerKeys
      .map((key) => document.querySelector<HTMLElement>(`[dev-target="${key}"].is-active`))
      .find(Boolean);

    if (initialTrigger) {
      const target = initialTrigger.getAttribute('dev-target');
      if (target) this.activate(target);
    } else {
      const firstKey = triggerKeys[0];
      if (firstKey) this.activate(firstKey);
    }
  }

  /**
   * Activates the given trigger and shows its corresponding panel.
   */
  private activate(triggerTarget: string): void {
    if (this.activeTrigger === triggerTarget) return;

    const panelTarget = this.triggerToPanel[triggerTarget];
    if (!panelTarget) return;

    // Update triggers: remove is-active from all, add to clicked
    Object.keys(this.triggerToPanel).forEach((key) => {
      const trigger = document.querySelector<HTMLElement>(`[dev-target="${key}"]`);
      trigger?.classList.toggle('is-active', key === triggerTarget);
    });

    // Update panels: hide all, show the active one
    Object.values(this.triggerToPanel).forEach((target) => {
      const panel = document.querySelector<HTMLElement>(`[dev-target="${target}"]`);
      panel?.classList.toggle('hide', target !== panelTarget);
    });

    this.toggleHousePlansCompanionTabs(triggerTarget);

    this.activeTrigger = triggerTarget;
  }

  private toggleHousePlansCompanionTabs(triggerTarget: string): void {
    if (!this.options.isHousePlansGallery) return;
    if (!this.options.firstTabSelector || !this.options.secondTabSelector) return;

    const firstTab = document.querySelector<HTMLElement>(this.options.firstTabSelector);
    const secondTab = document.querySelector<HTMLElement>(this.options.secondTabSelector);

    if (!firstTab || !secondTab) {
      console.error(
        'ExploreTabsController: No [dev-target="first-tab"] or [dev-target="second-tab"] found.'
      );
      return;
    }

    const firstTriggerKey = Object.keys(this.triggerToPanel)[0];
    const isExplorePlansActive = triggerTarget === firstTriggerKey;
    firstTab.classList.toggle('hide', !isExplorePlansActive);
    secondTab.classList.toggle('hide', isExplorePlansActive);
  }
}
