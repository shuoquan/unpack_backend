import { createParamDecorator } from '@nestjs/common';

export const UserDecorator = createParamDecorator((data, req) => {
  return req.switchToHttp().getRequest().user;
});
