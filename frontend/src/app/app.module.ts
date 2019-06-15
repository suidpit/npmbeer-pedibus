import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {MatChipsModule, MatDialogModule} from "@angular/material";
import { MatToolbarModule } from "@angular/material";
import { MatSidenavModule } from "@angular/material";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppComponent } from './app.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {DialogAddKid, StopRowComponent} from './components/stop-row/stop-row.component';
import { LoginComponent } from './components/auth/login/login.component';
import {AuthInterceptor} from "./services/auth/auth-interceptor";
import {RouterModule} from "@angular/router";
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {RegistrationComponent, DialogAddKidReg, DialogEmailSended} from './components/registration/registration.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  declarations: [
    AppComponent,
    ReservationsComponent,
    StopRowComponent,
    LoginComponent,
    ToolbarComponent,
    RegistrationComponent,
    DialogAddKid,
    DialogAddKidReg,
    DialogEmailSended
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: "login", component: LoginComponent},
      { path: "presenze", component: ReservationsComponent},
      { path: "registrazione", component: RegistrationComponent },
      { path: "**", redirectTo: "login", pathMatch: "full"}
    ]),
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatGridListModule,
    MatDividerModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatListModule,
    MatChipsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDialogModule,
    FlexLayoutModule,
    CdkStepperModule,
    MatStepperModule
  ],
  providers: [MatDatepickerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  entryComponents: [DialogAddKid,DialogAddKidReg,DialogEmailSended],
  bootstrap: [AppComponent]
})
export class AppModule { }
