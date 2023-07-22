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
    const compute = async () => {
      if (!token) {
        return false;
      }
      const u = this.userService.verifyToken(token);
      request.user = await this.userService.findByUsername(u.username);
      return true;
    };
    return compute();
  }
}
