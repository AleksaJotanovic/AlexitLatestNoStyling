import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const offerAvailableGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (route.queryParams['available'] === false) {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};
