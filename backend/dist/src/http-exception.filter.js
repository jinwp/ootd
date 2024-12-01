"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let UnexpectedExceptionFilter = class UnexpectedExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const resStatus = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        console.error("Unexpected exception", exception);
        console.error(exception);
        response.status(resStatus).json({
            statusCode: resStatus,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.UnexpectedExceptionFilter = UnexpectedExceptionFilter;
exports.UnexpectedExceptionFilter = UnexpectedExceptionFilter = __decorate([
    (0, common_1.Catch)()
], UnexpectedExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map