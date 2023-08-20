import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  errorMessage: string;

  constructor(
    private router: Router,
    private titleService: Title,
    private navigationService: NavigationService)
  {
    this.titleService.setTitle("Error");

    let errorCode = this.router.getCurrentNavigation()?.extras.state?.['errorCode'];

    switch (errorCode) {
      case 400:
        this.errorMessage = '400 Bad Request';
        break;
      case 403:
        this.errorMessage = '403 Forbidden - Access Denied';
        break;
      case errorCode >= 500:
        this.errorMessage = `${errorCode} Internal Server Error`;
        break;
      default:
        this.errorMessage = errorCode >= 400 ? `${errorCode} HTTP error` : 'Unknown server error';
        break;
    }
  }

  onGoHome() {
    this.navigationService.navigateToMainPage();
  }
}
