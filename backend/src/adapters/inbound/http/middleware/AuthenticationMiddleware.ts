import { Request, Response, NextFunction } from 'express';
import { requiresAuth } from '@auth0/auth0-express-api';
import { AuthenticatedActor } from '../../../../application/task/ports/outbound/AuthenticatedActor.js';
declare global {
  namespace Express {
    interface Request {
      actor?: AuthenticatedActor;
    }
  }
}
export const authenticationMiddleware = () => {
  const auth0RequiresAuth = requiresAuth();
  return async (req: Request, res: Response, next: NextFunction) => {
    const value = req.header('authorization');
    if (!value?.startsWith('Bearer ') || !value.slice(7).trim()) {
      res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication is required.',
        },
      });
      return;
    }
    await auth0RequiresAuth(req, res, () => {
      const token = req.auth0.user;
      if (!token?.sub) {
        res.status(401).json({
          error: { code: 'UNAUTHENTICATED', message: 'Authentication failed.' },
        });
        return;
      }
      const actor: AuthenticatedActor =
        typeof token.email === 'string'
          ? { id: token.sub, email: token.email }
          : { id: token.sub };
      req.actor = actor;
      next();
    });
  };
};
