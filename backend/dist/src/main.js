"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const path = require("node:path");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./http-exception.filter");
dotenv.config({
    path: path.resolve(process.env.NODE_ENV === 'local'
        ? '.env-local'
        : process.env.NODE_ENV === 'production'
            ? '.env-production'
            : '.env-dev'),
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.UnexpectedExceptionFilter());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('OOTD API')
        .setDescription('OOTD API description')
        .setVersion('1.0')
        .addTag('ootd')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map