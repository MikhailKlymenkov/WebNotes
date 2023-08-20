import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

export const errorGuard = () => {
  const router = inject(Router);
  const navigationService = inject(NavigationService);

  let errorCode = router.getCurrentNavigation()?.extras.state?.['errorCode'];
  if (errorCode !== null && errorCode !== undefined) {
    return true;
  }

  navigationService.navigateToMainPage();
  return false;
};
