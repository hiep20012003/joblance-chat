"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataURL = exports.isEmail = exports.toUpperCase = exports.lowerCase = exports.firstLetterUppercase = exports.BadRequestError = exports.CustomError = void 0;
exports.uploads = uploads;
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("cloudinary");
class CustomError extends Error {
    constructor(message, comingFrom) {
        super(message);
        this.comingFrom = comingFrom;
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    constructor(message, comingFrom) {
        super(message, comingFrom);
        this.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        this.status = 'error';
    }
}
exports.BadRequestError = BadRequestError;
function uploads(file, public_id, overwrite, invalidate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield cloudinary_1.v2.uploader.upload(file, {
                public_id,
                overwrite,
                invalidate,
                resource_type: 'auto',
            });
            return result;
        }
        catch (err) {
            if (err && typeof err === 'object' && 'message' in err) {
                return err;
            }
            return {
                message: 'Unknown upload error',
                name: 'UploadError',
                http_code: 500,
            };
        }
    });
}
var helpers_1 = require("@chat/types/helpers");
Object.defineProperty(exports, "firstLetterUppercase", { enumerable: true, get: function () { return helpers_1.firstLetterUppercase; } });
Object.defineProperty(exports, "lowerCase", { enumerable: true, get: function () { return helpers_1.lowerCase; } });
Object.defineProperty(exports, "toUpperCase", { enumerable: true, get: function () { return helpers_1.toUpperCase; } });
Object.defineProperty(exports, "isEmail", { enumerable: true, get: function () { return helpers_1.isEmail; } });
Object.defineProperty(exports, "isDataURL", { enumerable: true, get: function () { return helpers_1.isDataURL; } });
//# sourceMappingURL=chat.js.map