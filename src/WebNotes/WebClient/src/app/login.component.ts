import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './services/api/auth.service';
import { UserDto } from './dto/user.dto';
import { NavigationService } from './services/navigation.service';

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
    private navigationService: NavigationService)
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
        this.navigationService.signIn(response.jwtToken, response.role);
      },
      error: () => {
        this.isIncorrectUsernameOrPassword = true;
        this.isLoginInProgress = false;
      }
    });
  }
}
