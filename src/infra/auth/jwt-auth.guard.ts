import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './public'
import { ROLES_KEY } from './roles.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const authenticatedUser = context.switchToHttp().getRequest().user
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (authenticatedUser && roles) {
      if (roles.length === 0) {
        return true
      }

      const hasPermission = () => roles.includes(authenticatedUser?.role)

      if (!hasPermission()) {
        return false
      }
    }

    return super.canActivate(context)
  }
}
