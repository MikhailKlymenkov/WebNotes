import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageKeys } from '../local-storage-keys';
import { Roles } from '../roles';

@Injectable()
export class NavigationService {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router) { }

  signIn(jwtToken: string, role: string) {
    this.localStorageService.set(LocalStorageKeys.JWT_TOKEN_KEY, jwtToken);
    this.localStorageService.set(LocalStorageKeys.USER_ROLE_KEY, role);
    this.navigateToMainPage();
  }

  navigateToMainPage() {
    if (this.localStorageService.get(LocalStorageKeys.USER_ROLE_KEY) === Roles.ADMIN) {
      this.router.navigate(['/admin']);
    }
    else {
      this.router.navigate(['']);
    }
  }

  signOut() {
    this.localStorageService.remove(LocalStorageKeys.JWT_TOKEN_KEY);
    this.localStorageService.remove(LocalStorageKeys.USER_ROLE_KEY);
    this.router.navigate(['/login']);
  }
}
