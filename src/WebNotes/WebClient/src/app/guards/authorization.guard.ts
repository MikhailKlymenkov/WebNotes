import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { LocalStorageKeys } from '../local-storage-keys';

export const authorizationGuard = () => {
  const router = inject(Router);
  const localStorage = inject(LocalStorageService);

  if (localStorage.get(LocalStorageKeys.JWT_TOKEN_KEY))
    return true;

  router.navigate(['login']);
  return false;
};
