"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const health_route_1 = require("./health.route");
const appRoutes = (app) => {
    app.use('', health_route_1.healthRoutes.routes());
};
exports.appRoutes = appRoutes;
//# sourceMappingURL=index.js.map