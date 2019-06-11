import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Line } from './models/line';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private http: HttpClient) {}

  lines(): Observable<Line[]> {
    //TODO:  This will go in a config file
    let api_url = "http://127.0.0.1:8080/lines"
    console.log("Requesting from service...")
    return this.http.get<Line[]>(api_url);
  }
}
