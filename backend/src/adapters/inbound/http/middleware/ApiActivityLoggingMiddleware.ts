import { Request, Response, NextFunction } from 'express';
export const apiActivityLoggingMiddleware =
  (logger: Pick<Console, 'info'>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const started = Date.now();
    const safeHeaders = {
      ...req.headers,
      authorization: req.headers.authorization ? '[REDACTED]' : undefined,
    };
    res.on('finish', () =>
      logger.info(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          actor: req.actor?.id ?? null,
          method: req.method,
          path: req.path,
          params: req.params,
          query: req.query,
          headers: safeHeaders,
          statusCode: res.statusCode,
          durationMs: Date.now() - started,
        })
      )
    );
    next();
  };
