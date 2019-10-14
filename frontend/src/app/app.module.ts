import { CalendarUtils as BaseCalendarUtils } from 'angular-calendar';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularResizedEventModule} from 'angular-resize-event';
import {NgPipesModule} from 'ngx-pipes';
import {
    MatBadgeModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSortModule,
    MatTableModule
} from "@angular/material";
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
import {
  DialogEventAdmin,
  DialogEventNormal,
  ShiftAvailabilitiesComponent
} from './components/shifts/shift-availabilities/shift-availabilities.component';
import {AttendanceComponent} from './components/attendance/attendance.component';
import {StopListRowComponent} from './components/stop-list/stop-list-row/stop-list-row.component';
import {StopListComponent} from './components/stop-list/stop-list.component';
import {StopElementComponent} from './components/stop-list/stop-element/stop-element.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {AuthGuard} from "./guards/auth-guard/auth-guard";
import {Role} from "./models/authority";
import {
  NewRegistrationEmailComponent,
  DialogEmailExistsNewReg,
  DialogEmailSendedNewReg
} from './components/new-registration-email/new-registration-email.component';
import { UserPasswordSetupComponent, PizzaPartyComponent } from './components/user-password-setup/user-password-setup.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import {NoAuthnGuard} from "./guards/no-authn-guard/no-authn-guard.service";
import { ShiftConfirmationComponent } from './components/shifts/shift-confirmation/shift-confirmation.component';
import { LateralmenuComponent } from './components/profileInfo/lateralmenu/lateralmenu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ProfileComponent } from './components/profileInfo/profile/profile.component';

import { HomeComponent } from './components/home/home.component';
import { KidTrackerComponent } from './components/kid-tracker/kid-tracker.component';
import {AgmCoreModule} from "@agm/core";
import { SimpleEventLoggerComponent } from './components/simple-event-logger/simple-event-logger.component';

import {
    ChildCardComponent,
    ManageChildrenComponent
} from './components/profileInfo/manage-children/manage-children.component';
import { ChangePasswordComponent } from './components/profileInfo/change-password/change-password.component';
import { ManageUsersComponent } from './components/profileInfo/manage-users/manage-users.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {MyCalendarUtilsComponent} from "./components/reservations/MyCalendarUtils.component";


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
    DialogEventNormal,
    DialogEventAdmin,
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
    UnauthorizedComponent,
    ShiftConfirmationComponent,
    LateralmenuComponent,
    ProfileComponent,
    HomeComponent,
    KidTrackerComponent,
    SimpleEventLoggerComponent,
    ManageChildrenComponent,
    ChildCardComponent,
    ChangePasswordComponent,
    ManageUsersComponent,
  ],
  imports: [
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }, {
      utils: {
        provide: BaseCalendarUtils,
        useClass: MyCalendarUtilsComponent
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: "home", component: HomeComponent},
      { path: "trovaBambino", component: KidTrackerComponent, canActivate: [AuthGuard], data: {roles: [Role.USER]}},
      { path: "login", component: LoginComponent, canActivate: [NoAuthnGuard]},
      { path: "presenze", component: AttendanceComponent, canActivate: [AuthGuard], data: {roles: [Role.USER]}},
      { path: "registrazione", component: RegistrationComponent, canActivate: [NoAuthnGuard] },
      { path: "admin/turni", component: ShiftPageComponent, canActivate: [AuthGuard], data: {roles: [Role.USER]}},
      { path: "registrazioneEmail", component: NewRegistrationEmailComponent},
      { path: "impostaPassword/:token", component: UserPasswordSetupComponent},
      { path: "auth_error" , component: UnauthorizedComponent},
      { path: "prenotazione", component: ReservationsComponent, canActivate: [AuthGuard], data: {roles: [Role.USER]}},
      { path: "eventi", component: SimpleEventLoggerComponent},
      { path: "profilo", component: LateralmenuComponent, canActivate: [AuthGuard], data:{roles: [Role.USER]}},
      { path: "**", redirectTo: "home", pathMatch: "full"}
    ]),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBvrioINDkg1n41aEPstcosZp4Tb5QB66o"
    }),
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
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
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatExpansionModule,
    FlexLayoutModule,
    CdkStepperModule,
    MatStepperModule,
    FullCalendarModule,
    MatSnackBarModule,
    AngularResizedEventModule,
    LayoutModule,
    NgPipesModule
  ],
  providers: [MatDatepickerModule, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  entryComponents: [DialogAddKid,DialogAddKidReg,DialogEmailSended, DialogEmailExists, DialogEmailExistsNewReg,
                    DialogEventInfo, DialogEventNormal, DialogEventAdmin, DialogEmailSendedNewReg, PizzaPartyComponent, BookingDialog],
  bootstrap: [AppComponent]

}) export class AppModule {
}
