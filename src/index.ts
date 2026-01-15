import { NavbarAnimationController } from '$utils/navbar-animation';

window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialize navbar animations
  const navbarController = new NavbarAnimationController();
  navbarController.init();
});
