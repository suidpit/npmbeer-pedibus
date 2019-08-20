import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularResizedEventModule} from 'angular-resize-event';
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
import {MatChipsModule, MatDialogModule} from "@angular/material";
import {MatToolbarModule} from "@angular/material";
import {MatSidenavModule} from "@angular/material";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";

import {AppComponent} from './app.component';
import {BookingDialog, ReservationsComponent} from './components/reservations/reservations.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {DialogAddKid, StopRowComponent} from './components/stop-row/stop-row.component';
import {LoginComponent} from './components/auth/login/login.component';
import {AuthInterceptor} from "./services/auth/auth-interceptor";
import {RouterModule} from "@angular/router";
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {
    RegistrationComponent,
    DialogAddKidReg,
    DialogEmailSended,
    DialogEmailExists
} from './components/registration/registration.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatStepperModule} from '@angular/material/stepper';
import {AttendanceComponent} from './components/attendance/attendance.component';
import {StopListRowComponent} from './components/stop-list/stop-list-row/stop-list-row.component';
import {StopListComponent} from './components/stop-list/stop-list.component';
import {StopElementComponent} from './components/stop-list/stop-element/stop-element.component';
import {SpinnerComponent} from './components/spinner/spinner.component';

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
        BookingDialog,
        DialogEmailSended,
        DialogEmailExists,
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
            {path: "login", component: LoginComponent},
            {path: "presenze", component: AttendanceComponent},
            {path: "registrazione", component: RegistrationComponent},
            {path: "prenotazione", component: ReservationsComponent},
            {path: "**", redirectTo: "login", pathMatch: "full"}
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
        MatDialogModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatListModule,
        MatChipsModule,
        MatToolbarModule,
        MatSidenavModule,
        FlexLayoutModule,
        CdkStepperModule,
        MatStepperModule,
        AngularResizedEventModule,

    ],
    providers: [MatDatepickerModule, {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }],
    entryComponents: [DialogAddKid, DialogAddKidReg, DialogEmailSended, DialogEmailExists, BookingDialog],
    bootstrap: [AppComponent]
})
export class AppModule {
}
