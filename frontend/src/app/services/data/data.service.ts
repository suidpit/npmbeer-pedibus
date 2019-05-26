import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReservation } from 'src/app/interfaces/reservations';
import { IUser } from 'src/app/interfaces/user';
import { ILine } from 'src/app/interfaces/line';



@Injectable({
  providedIn: 'root'
})

export class DataService {

  private reservation_url = "/assets/data/reservation.json";

  private line_url = "/assets/data/line.json";

  private user_url = "/assets/data/user.json";


  constructor(private http: HttpClient) { }

  getReservation(): Observable<IReservation[]>{
    return this.http.get<IReservation[]>(this.reservation_url);
  }

  getLines(): Observable<ILine[]>{
    return this.http.get<ILine[]>(this.line_url);
  }

   getUsers(): Observable<IUser[]>{
    return this.http.get<IUser[]>(this.user_url);

  }
}
