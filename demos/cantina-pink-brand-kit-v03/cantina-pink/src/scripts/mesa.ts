// /mesa es liviana (sin JS del sitio), pero los precios que cambian las dueñas desde /admin tienen que verse también acá.
import { fetchOverrides, patchDom } from './overrides-dom';

fetchOverrides().then((ov) => { if (ov) patchDom(ov); });
