import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Line} from "../../models/line";

@Injectable({
  providedIn: 'root'
})
export class LineService {

  private server_url = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getLineByName(lineName: string): Observable<any>{
    return this.http.get(`${this.server_url}/lines/${lineName}`);
  }
}
