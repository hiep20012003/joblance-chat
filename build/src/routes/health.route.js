"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const health_controller_1 = require("@chat/controllers/health.controller");
const express_1 = __importDefault(require("express"));
class HealthRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/gateway-health', new health_controller_1.HealthController().health);
        return this.router;
    }
}
exports.healthRoutes = new HealthRoutes();
//# sourceMappingURL=health.route.js.map