"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const joblance_shared_1 = require("@hiep20012003/joblance-shared");
const http_status_codes_1 = require("http-status-codes");
class HealthController {
    constructor() {
        this.health = (_req, res, _next) => {
            new joblance_shared_1.SuccessResponse({
                message: 'Chat service healthy',
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                reasonPhrase: http_status_codes_1.ReasonPhrases.CREATED,
            }).send(res);
        };
    }
}
exports.HealthController = HealthController;
//# sourceMappingURL=health.controller.js.map