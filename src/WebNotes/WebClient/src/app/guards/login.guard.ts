import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { LocalStorageKeys } from '../local-storage-keys';
import { NavigationService } from '../services/navigation.service';

export const loginGuard = () => {
  const localStorage = inject(LocalStorageService);
  const navigationService = inject(NavigationService);

  if (localStorage.get(LocalStorageKeys.JWT_TOKEN_KEY)) {
    navigationService.navigateToMainPage();
    return false;
  }

  return true;
};
