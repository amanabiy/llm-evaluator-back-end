import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { UserRoleEnum } from '../../user/entities/user-role.enum';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    // const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
    //   'roles',
    //   [context.getHandler(), context.getClass()],
    // );
    const requiredRoles = undefined
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }
    const body = context.switchToHttp().getRequest();
    const user = body.user
    if (!user || !user.role || !requiredRoles.includes(user.role.roleName)) {
      console.log(user, requiredRoles)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
