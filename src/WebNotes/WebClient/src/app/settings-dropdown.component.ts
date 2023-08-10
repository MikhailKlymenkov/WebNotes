import { Component } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { Router } from '@angular/router';
import { LocalStorageKeys } from './local-storage-keys';

@Component({
  selector: 'settings-dropdown',
  templateUrl: './settings-dropdown.component.html',
  styleUrls: ['./settings-dropdown.component.css']
})
export class SettingsDropdownComponent {
  showDropdown = false;

  constructor(private localStorageService: LocalStorageService, private router: Router) { }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  signOut(): void {
    this.localStorageService.remove(LocalStorageKeys.JWT_TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
