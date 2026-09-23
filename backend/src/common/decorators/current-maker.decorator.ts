import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentMaker = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.appMaker) {
      return null;
    }
    return data ? request.appMaker[data] : request.appMaker;
  },
);
