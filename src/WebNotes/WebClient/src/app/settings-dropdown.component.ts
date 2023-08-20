import { Component } from '@angular/core';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'settings-dropdown',
  templateUrl: './settings-dropdown.component.html',
  styleUrls: ['./settings-dropdown.component.css']
})
export class SettingsDropdownComponent {
  showDropdown = false;

  constructor(private navigationService: NavigationService) { }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  signOut(): void {
    this.navigationService.signOut();
  }
}
