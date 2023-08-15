import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './services/api/auth.service';
import { LocalStorageService } from './services/local-storage.service';
import { LocalStorageKeys } from './local-storage-keys';
import { Router } from '@angular/router';
import { UserDto } from './dto/user.dto';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  private readonly minTextLength = 4;
  private readonly maxTextLength = 30;

  readonly usernameControlName = "username";
  readonly passwordControlName = "password";

  isLoginInProgress = false;
  isUsernameInvalid = false;
  isPasswordInvalid = false;
  isIncorrectUsernameOrPassword = false;

  loginForm!: FormGroup;

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router)
  {
    this.titleService.setTitle("Login");
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      [this.usernameControlName]: new FormControl("", [Validators.required, Validators.minLength(this.minTextLength), Validators.maxLength(this.maxTextLength)]),
      [this.passwordControlName]: new FormControl("", [Validators.required, Validators.minLength(this.minTextLength), Validators.maxLength(this.maxTextLength)])
    });

    this.loginForm.controls[this.usernameControlName].valueChanges.subscribe(() => {
      this.isUsernameInvalid = false;
      this.isIncorrectUsernameOrPassword = false;
    });

    this.loginForm.controls[this.passwordControlName].valueChanges.subscribe(() => {
      this.isPasswordInvalid = false;
      this.isIncorrectUsernameOrPassword = false;
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.isUsernameInvalid = this.loginForm.controls[this.usernameControlName].invalid;
      this.isPasswordInvalid = this.loginForm.controls[this.passwordControlName].invalid;
      return;
    }

    const username = this.loginForm.controls[this.usernameControlName].value;
    const password = this.loginForm.controls[this.passwordControlName].value;

    this.isLoginInProgress = true;
    const userDTO: UserDto = { username, password };
    this.authService.login(userDTO).subscribe({
      next: (response) => {
        this.isLoginInProgress = false;
        this.localStorageService.set(LocalStorageKeys.JWT_TOKEN_KEY, response.jwtToken);
        this.router.navigate(['']);
      },
      error: () => {
        this.isIncorrectUsernameOrPassword = true;
        this.isLoginInProgress = false;
      }
    });
  }
}
