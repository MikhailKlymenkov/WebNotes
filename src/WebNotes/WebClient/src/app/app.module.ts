import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { NoteListComponent } from './note-list.component';
import { ErrorComponent } from './error.component';
import { NotFoundComponent } from './not-found.component';

import { authorizationGuard } from './guards/authorization.guard';
import { loginGuard } from './guards/login.guard';
import { errorGuard } from './guards/error.guard';
import { AppHttpInterceptor } from './app-http-interceptor';

import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/api/auth.service';
import { SettingsDropdownComponent } from './settings-dropdown.component';

const appRoutes: Routes = [
  { path: '', component: NoteListComponent, canActivate: [authorizationGuard] },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },
  { path: 'error', component: ErrorComponent, canActivate: [errorGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NoteListComponent,
    ErrorComponent,
    NotFoundComponent,
    SettingsDropdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    LocalStorageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
