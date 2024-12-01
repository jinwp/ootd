"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const postings_module_1 = require("./postings/postings.module");
const chat_gateway_1 = require("./chat/chat.gateway");
const prisma_service_1 = require("./prisma.service");
const chat_controller_1 = require("./chat/chat.controller");
const chat_service_1 = require("./chat/chat.service");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot(), auth_module_1.AuthModule, users_module_1.UsersModule, postings_module_1.PostingsModule],
        controllers: [app_controller_1.AppController, chat_controller_1.ChatController],
        providers: [app_service_1.AppService, chat_gateway_1.ChatGateway, prisma_service_1.PrismaService, chat_service_1.ChatService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map