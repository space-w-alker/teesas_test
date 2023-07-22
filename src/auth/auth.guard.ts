import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const token = (headers.authorization ?? headers.authorizations)?.split(
      ' ',
    )[1];
    if (!token) {
      return false;
    }
    request.user = this.userService.verifyToken(token);
    delete request.user.iat;
    return true;
  }
}
