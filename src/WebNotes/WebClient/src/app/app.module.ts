import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { MainComponent } from './main.component';
import { NoteListComponent } from './note-list.component';
import { ErrorComponent } from './error.component';
import { NotFoundComponent } from './not-found.component';
import { SettingsDropdownComponent } from './settings-dropdown.component';
import { ConfirmationPopupComponent } from './confirmation-popup.component';
import { AdminPageComponent } from './admin-page.component';

import { authorizationGuard } from './guards/authorization.guard';
import { loginGuard } from './guards/login.guard';
import { errorGuard } from './guards/error.guard';
import { adminGuard } from './guards/admin.guard';
import { AppHttpInterceptor } from './app-http-interceptor';

import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/api/auth.service';
import { NotesService } from './services/api/notes.service';
import { AdminService } from './services/api/admin.service';
import { NavigationService } from './services/navigation.service';


const appRoutes: Routes = [
  { path: '', component: MainComponent, canActivate: [authorizationGuard] },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },
  { path: 'error', component: ErrorComponent, canActivate: [errorGuard] },
  { path: 'admin', component: AdminPageComponent, canActivate: [adminGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    NoteListComponent,
    ErrorComponent,
    NotFoundComponent,
    SettingsDropdownComponent,
    ConfirmationPopupComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [
    LocalStorageService,
    AuthService,
    NotesService,
    AdminService,
    NavigationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
