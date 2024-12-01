import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  //쓸줄 모르겠음
  async validate(payload) {
    return { user_id: payload.user_id };
  }
  //
  // static extractJwtFromWsHandshake(req: Request | any): string | null {
  //   if (req.handshake && req.handshake.auth && req.handshake.auth.token) {
  //     return req.handshake.auth.token; // Extract token from WebSocket handshake auth
  //   }
  //   return null;
  // }
}
