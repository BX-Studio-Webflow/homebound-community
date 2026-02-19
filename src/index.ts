import { StickyNavController } from '$utils/sticky-nav';

window.Webflow ||= [];
window.Webflow.push(() => {

  const stickyNavController = new StickyNavController();
  stickyNavController.init();
});
