import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularResizedEventModule} from 'angular-resize-event';
import { MatBadgeModule } from "@angular/material";
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule, MatDialogModule, MatSnackBarModule} from "@angular/material";
import { MatToolbarModule } from "@angular/material";
import { MatSidenavModule } from "@angular/material";
import { MatTooltipModule } from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";

import { AppComponent } from './app.component';
import { BookingDialog, ReservationsComponent} from './components/reservations/reservations.component';
import { HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { DialogAddKid, StopRowComponent} from './components/stop-row/stop-row.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthInterceptor} from "./services/auth/auth-interceptor";
import { RouterModule} from "@angular/router";
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {
          RegistrationComponent,
          DialogAddKidReg,
          DialogEmailSended,
          DialogEmailExists
        } from './components/registration/registration.component';
import { CdkStepperModule} from '@angular/cdk/stepper';
import { MatStepperModule} from '@angular/material/stepper';

import { FullCalendarModule } from "@fullcalendar/angular";

import { UpcomingShiftsComponent } from './components/shifts/upcoming-shifts/upcoming-shifts.component';
import { ShiftChipComponent } from './components/shifts/shift-chip/shift-chip.component';
import { DialogEventInfo, ShiftCalendarComponent} from './components/shifts/shift-calendar/shift-calendar.component';
import { ShiftPageComponent } from './components/shifts/shift-page/shift-page.component';
import { ShiftAvailabilitiesComponent } from './components/shifts/shift-availabilities/shift-availabilities.component';
import {AttendanceComponent} from './components/attendance/attendance.component';
import {StopListRowComponent} from './components/stop-list/stop-list-row/stop-list-row.component';
import {StopListComponent} from './components/stop-list/stop-list.component';
import {StopElementComponent} from './components/stop-list/stop-element/stop-element.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {AuthGuard} from "./guards/auth-guard/auth-guard";
import {Role} from "./models/user";
import {
  NewRegistrationEmailComponent,
  DialogEmailExistsNewReg,
  DialogEmailSendedNewReg
} from './components/new-registration-email/new-registration-email.component';
import { UserPasswordSetupComponent, PizzaPartyComponent } from './components/user-password-setup/user-password-setup.component';


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
    DialogEmailSended,
    DialogEmailExists,
    DialogEventInfo,
    UpcomingShiftsComponent,
    ShiftChipComponent,
    ShiftCalendarComponent,
    ShiftPageComponent,
    ShiftAvailabilitiesComponent,
    NewRegistrationEmailComponent,
    DialogEmailExistsNewReg,
    DialogEmailSendedNewReg,
    BookingDialog,
    UserPasswordSetupComponent,
    PizzaPartyComponent,
    AttendanceComponent,
    StopListRowComponent,
    StopListComponent,
    StopElementComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: "login", component: LoginComponent},
      { path: "presenze", component: AttendanceComponent, canActivate: [AuthGuard], data: {roles: [Role.USER]}},
      { path: "registrazione", component: RegistrationComponent },
      { path: "admin/turni", component: ShiftPageComponent, canActivate: [AuthGuard], data: {roles: [Role.USER]}},
      { path: "registrazioneEmail", component: NewRegistrationEmailComponent},
      { path: "impostaPassword/:token", component: UserPasswordSetupComponent},
      { path: "prenotazione", component: ReservationsComponent},
      { path: "**", redirectTo: "login", pathMatch: "full"}
    ]),
    HttpClientModule,
    MatBadgeModule,
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
    MatTooltipModule,
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
    MatStepperModule,
    FullCalendarModule,
    MatSnackBarModule,
    AngularResizedEventModule,
  ],
  providers: [MatDatepickerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  entryComponents: [DialogAddKid,DialogAddKidReg,DialogEmailSended, DialogEmailExists, DialogEmailExistsNewReg,
                    DialogEventInfo, DialogEmailSendedNewReg, PizzaPartyComponent, BookingDialog],
  bootstrap: [AppComponent]

})
export class AppModule {
}
