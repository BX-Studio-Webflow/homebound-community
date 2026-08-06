import '$styles/rebuild-map.css';

import { RebuildMapController } from '$utils/rebuild-map';

window.Webflow ||= [];
window.Webflow.push(() => {
  const rebuildMapController = new RebuildMapController();
  rebuildMapController.init();
});
