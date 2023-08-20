import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { LocalStorageKeys } from '../local-storage-keys';
import { Roles } from '../roles';

export const adminGuard = () => {
  const router = inject(Router);
  const localStorage = inject(LocalStorageService);

  if (localStorage.get(LocalStorageKeys.USER_ROLE_KEY) === Roles.ADMIN) {
    return true;
  }

  router.navigate(['']);
  return false;
};
