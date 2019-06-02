import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatCheckboxModule, MatCardModule, MatMenuModule, MatButtonToggleModule,
        MatSelectModule, MatGridListModule, MatDividerModule, MatDatepickerModule,
        MatNativeDateModule, MatInputModule, MatTabsModule, MatListModule, MatChipsModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ReservationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    MatChipsModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
