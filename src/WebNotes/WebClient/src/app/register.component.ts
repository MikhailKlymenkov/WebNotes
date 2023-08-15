import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { AuthService } from './services/api/auth.service';
import { LocalStorageService } from './services/local-storage.service';
import { Router } from '@angular/router';
import { LocalStorageKeys } from './local-storage-keys';
import { UserDto } from './dto/user.dto';

@Component({
  selector: 'register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
  private readonly minTextLength = 4;
  private readonly maxTextLength = 30;

  readonly usernameControlName = "username";
  readonly passwordControlName = "password";
  readonly repeatPasswordControlName = "repeatPassword";

  isRegisterInProgress = false;
  isUsernameInvalid = false;
  isPasswordInvalid = false;
  arePasswordsNotMatch = false;
  isUserExists = false;

  registerForm!: FormGroup;

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router)
  {
    this.titleService.setTitle("Register");
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      [this.usernameControlName]: new FormControl("", [Validators.required, Validators.minLength(this.minTextLength), Validators.maxLength(this.maxTextLength)]),
      [this.passwordControlName]: new FormControl("", [Validators.required, Validators.minLength(this.minTextLength), Validators.maxLength(this.maxTextLength)]),
      [this.repeatPasswordControlName]: new FormControl("", [<ValidatorFn>this.passwordMatchValidator.bind(this)])
    });

    this.registerForm.controls[this.usernameControlName].valueChanges.subscribe(() => {
      this.isUsernameInvalid = false;
      this.isUserExists = false;
    });

    this.registerForm.controls[this.passwordControlName].valueChanges.subscribe(() => {
      this.isPasswordInvalid = false;
      this.arePasswordsNotMatch = false;

      this.registerForm.controls[this.repeatPasswordControlName].updateValueAndValidity();
    });

    this.registerForm.controls[this.repeatPasswordControlName].valueChanges.subscribe(() => {
      this.arePasswordsNotMatch = false;
    });
  }

  submit() {
    if (this.registerForm.invalid) {
      this.isUsernameInvalid = this.registerForm.controls[this.usernameControlName].invalid;
      this.isPasswordInvalid = this.registerForm.controls[this.passwordControlName].invalid;
      this.arePasswordsNotMatch = this.registerForm.controls[this.repeatPasswordControlName].invalid;
      return;
    }

    const username = this.registerForm.controls[this.usernameControlName].value;
    const password = this.registerForm.controls[this.passwordControlName].value;

    this.isRegisterInProgress = true;
    const userDTO: UserDto = { username, password };
    this.authService.register(userDTO).subscribe({
      next: (response) => {
        this.isRegisterInProgress = false;
        this.localStorageService.set(LocalStorageKeys.JWT_TOKEN_KEY, response.jwtToken);
        this.router.navigate(['']);
      },
      error: () => {
        this.isUserExists = true;
        this.isRegisterInProgress = false;
      }
    });
  }

  passwordMatchValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = this.registerForm?.controls[this.passwordControlName]?.value;
    const repeatPassword = control.value;

    if (password !== undefined && password !== repeatPassword) {
      return { 'passwordMismatch': true };
    }

    return null;
  }
}
