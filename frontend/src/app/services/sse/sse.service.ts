import { Injectable } from '@angular/core';
import {EventSourcePolyfill} from 'event-source-polyfill';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor() {
  }

  getEventSource(url: string): EventSourcePolyfill {
    let token = localStorage.getItem('token_id');
    return new EventSourcePolyfill(url, { headers: {
      'Authorization': 'bearer ' + token
    }})
  }
}
