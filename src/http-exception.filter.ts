import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch() // BaseException을 상속한 exception에 대해서 실행됨.
export class UnexpectedExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const resStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    console.error("Unexpected exception", exception);
    console.error(exception);
    //
    response.status(resStatus).json({
      // todo: exception의 response 형식 결정되면 변경해야함.
      statusCode: resStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
