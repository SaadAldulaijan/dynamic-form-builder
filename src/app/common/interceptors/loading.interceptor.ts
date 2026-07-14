import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { GlobalLoaderService } from '../services/global-loader';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const globalLoader = inject(GlobalLoaderService);

  globalLoader.show();

  return next(req).pipe(
    finalize(() => globalLoader.hide())
  );
};