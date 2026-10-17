import { HttpInterceptorFn } from '@angular/common/http';
import { env } from '../_env/env';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(env.jwtAccessToken);

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
