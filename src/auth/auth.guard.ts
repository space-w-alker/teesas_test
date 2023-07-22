import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';
import { Role } from '../user/user.model';
import { SESSION_TERMINATED } from '../constants/exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const token = (headers.authorization ?? headers.authorizations)?.split(
      ' ',
    )[1];
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const compute = async () => {
      if (!token) {
        return false;
      }
      let user = this.userService.verifyToken(token);
      user = await this.userService.findByUsername(user.username);
      if (
        user.sessions.findIndex((session) => session.token === token) === -1
      ) {
        throw SESSION_TERMINATED;
      }

      if (roles && !roles.includes(user.role)) {
        return false;
      }
      request.user = user;
      return true;
    };
    return compute();
  }
}
