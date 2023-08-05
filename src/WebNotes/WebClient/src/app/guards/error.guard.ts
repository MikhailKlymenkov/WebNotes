import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export const errorGuard = () => {
  const router = inject(Router);

  let errorCode = router.getCurrentNavigation()?.extras.state?.['errorCode'];
  if (errorCode !== null && errorCode !== undefined) {
    return true;
  }

  router.navigate(['']);
  return false;
};
