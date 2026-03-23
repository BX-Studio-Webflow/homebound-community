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

const TRIGGER_TO_PANEL: Record<string, string> = {
  'explore-plans-trigger': 'explore-plans-tab',
  'explore-homes-trigger': 'explore-homes-tab',
};

export class ExploreTabsController {
  private activeTrigger: string | null = null;

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

    Object.entries(TRIGGER_TO_PANEL).forEach(([triggerTarget, panelTarget]) => {
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

    // Set initial state from the first trigger marked is-active, or default to explore-plans
    const initialTrigger =
      document.querySelector<HTMLElement>('[dev-target="explore-plans-trigger"].is-active') ??
      document.querySelector<HTMLElement>('[dev-target="explore-homes-trigger"].is-active');

    if (initialTrigger) {
      const target = initialTrigger.getAttribute('dev-target');
      if (target) this.activate(target);
    } else {
      this.activate('explore-plans-trigger');
    }
  }

  /**
   * Activates the given trigger and shows its corresponding panel.
   */
  private activate(triggerTarget: string): void {
    if (this.activeTrigger === triggerTarget) return;

    const panelTarget = TRIGGER_TO_PANEL[triggerTarget];
    if (!panelTarget) return;

    // Update triggers: remove is-active from all, add to clicked
    Object.keys(TRIGGER_TO_PANEL).forEach((key) => {
      const trigger = document.querySelector<HTMLElement>(`[dev-target="${key}"]`);
      trigger?.classList.toggle('is-active', key === triggerTarget);
    });

    // Update panels: hide all, show the active one
    Object.values(TRIGGER_TO_PANEL).forEach((target) => {
      const panel = document.querySelector<HTMLElement>(`[dev-target="${target}"]`);
      panel?.classList.toggle('hide', target !== panelTarget);
    });

    this.activeTrigger = triggerTarget;
  }
}
