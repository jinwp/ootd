import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
export declare class UnexpectedExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
