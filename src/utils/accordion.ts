/**
 * Amenities accordion hover controller.
 * Adds is-active to the hovered [dev-target="accordion-item"] and removes it
 * from all siblings, so only one item is highlighted at a time.
 */
export class AccordionController {
  init(): void {
    const items = document.querySelectorAll<HTMLElement>('[dev-target="accordion-item"]');

    if (!items.length) {
      console.error('AccordionController: No [dev-target="accordion-item"] elements found.');
      return;
    }

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        items.forEach((i) => i.classList.remove('is-active'));
        item.classList.add('is-active');
      });

      item.addEventListener('mouseleave', () => {
        item.classList.remove('is-active');
      });
    });
  }
}
