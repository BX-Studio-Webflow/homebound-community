import './styles/sooner-accordion.css';

import { SoonerAccordionController } from '$utils/sooner-accordion';

window.Webflow ||= [];
window.Webflow.push(() => {
  const faqAccordionController = new SoonerAccordionController();
  faqAccordionController.init();
});
