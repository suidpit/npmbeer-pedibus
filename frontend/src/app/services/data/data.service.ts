import { Injectable } from '@angular/core';
import { Line } from "../../models/line";
import { Builder } from "builder-pattern";
import { Observable, of } from "rxjs";
import { LocalTime, LocalDateTime } from "js-joda";
import { Stop } from "../../models/stop";
import { StopList } from "../../models/stop-list";

import { CHILDS } from '../mock-childs'

@Injectable({
   providedIn: 'root'
})

export class DataService {

   reservation_db = [
      {
         "_id": "5ce930a382ce95d654ff3865",
         "date": "2019-05-29T21:00:00Z",
         "lineName": "linea1",
         "stopName": "P.za Solferino",
         "childName": "Aldo",
         "direction": "OUTWARD",
         "tripIndex": 0,
      },
      {
         "_id": "5ce9312c82ce95d654ff3866",
         "date": "2019-05-29T21:00:00Z",
         "lineName": "linea1",
         "stopName": "P.za Castello",
         "childName": "Giovanni",
         "direction": "OUTWARD",
         "tripIndex": 0,
      },
      {
         "_id": "5ce9314482ce95d654ff3867",
         "date": "2019-05-29T21:00:00Z",
         "lineName": "linea1",
         "stopName": "Sansa",
         "childName": "Giacomo",
         "direction": "OUTWARD",
         "tripIndex": 0,
      }
   ];

   line_db = [
      {
         "_id": "5cdd97716178bd763090819e",
         "name": "linea2",
         "outward": [
            [
               {
                  "name": "P.ta Susa",
                  "time": "2019-05-16T05:00:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "Vinzaglio",
                  "time": "2019-05-16T05:15:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "Poli",
                  "time": "2019-05-16T05:30:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               }
            ]
         ],
         "back": [
            [
               {
                  "name": "Poli",
                  "time": "2019-05-16T09:30:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "Vinzaglio",
                  "time": "2019-05-16T09:45:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "P.ta Susa",
                  "time": "2019-05-16T10:00:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               }
            ],
            [
               {
                  "name": "Poli",
                  "time": "2019-05-16T13:00:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "Vinzaglio",
                  "time": "2019-05-16T13:15:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "P.ta Susa",
                  "time": "2019-05-16T13:30:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               }
            ]
         ],
         "admin_email": "n@palm.beer",
         "_class": "it.polito.ai.pedibus.api.models.Line"
      },
      {
         "_id": "5cdd97716178bd763090819d",
         "name": "linea1",
         "outward": [
            [
               {
                  "name": "P.za Solferino",
                  "time": "2019-05-16T05:00:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "P.za Castello",
                  "time": "2019-05-16T05:15:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "Sansa",
                  "time": "2019-05-16T05:30:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               }
            ]
         ],
         "back": [
            [
               {
                  "name": "Sansa",
                  "time": "2019-05-16T09:30:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "P.za Castello",
                  "time": "2019-05-16T09:45:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "P.za Solferino",
                  "time": "2019-05-16T10:00:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               }
            ],
            [
               {
                  "name": "Sansa",
                  "time": "2019-05-16T13:00:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "P.za Castello",
                  "time": "2019-05-16T13:15:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               },
               {
                  "name": "P.za Solferino",
                  "time": "2019-05-16T13:30:00Z",
                  "position": {
                     "type": "Point",
                     "coordinates": [
                        46.24,
                        7.68
                     ]
                  }
               }
            ]
         ],
         "admin_email": "admin@me.com",
         "_class": "it.polito.ai.pedibus.api.models.Line"
      }
   ];

   user_db = [
      {
         "_id": "5cdd97716178bd763090819f",
         "email": "n@palm.beer",
         "password": "$2a$10$A/hrVydgqrFBXFcW0aYBtubE8MYN5C/nGQTat3gOjOMwiwBGucJZK",
         "roles": [
            "USER",
            "SYSTEM_ADMIN"
         ],
         "authorities": [
            {
               "line_names": [
                  "linea1"
               ],
               "authority": "SYSTEM_ADMIN"
            }
         ],
         "enabled": true,
         "_class": "it.polito.ai.pedibus.api.models.User"
      },
      {
         "_id": "5cdd98d16178bd76309081a0",
         "email": "dademanna@gmail.com",
         "password": "$2a$10$6sdwtCRALpAGZsh/9EYmL.923NuTvotc9o89X0yWUrMDc5WFrdQ62",
         "roles": [
            "USER"
         ],
         "authorities": [
            {
               "line_names": [

               ],
               "authority": "USER"
            },
            {
               "line_names": [
                  "linea1",
                  "linea2"
               ],
               "authority": "ADMIN"
            }
         ],
         "enabled": true,
         "_class": "it.polito.ai.pedibus.api.models.User"
      }
   ];

   private lines: Line[] = null;

   constructor() { }

   getLines() {
      if (this.lines === null) {
         /*
         * On the next lines we are building the lines array by mapping the data received from the db to:
         * 1st -> the outward-inward(back) stops: Array<StopList> per line
         * 2nd -> the lines themselves
         * All of this though the aid of the .map array function and the Builder class which implements
         * the builder pattern, check: https://github.com/Vincent-Pang/builder-pattern
         * */
         this.lines = this.line_db.map(function (line) {
            let outwards: Array<StopList> = [];
            let backs: Array<StopList> = [];

            // map outwards
            for (let out of line.outward) {
               let stopList = Builder(StopList)
                  .stops(out.map(function (stop) {
                     let d = LocalDateTime.parse(stop.time.replace("Z", ""));
                     let time = LocalTime.of(d.hour(), d.minute(), d.second());
                     return Builder(Stop)
                        .name(stop.name)
                        .time(time)
                        .position(stop.position)
                        .childs(CHILDS.map(x => Object.assign({}, x)))
                        .build();
                  }))
                  .build();
               outwards.push(stopList);
            }

            // map inwards
            for (let b of line.back) {
               let stopList = Builder(StopList)
                  .stops(b.map(function (stop) {
                     let d = LocalDateTime.parse(stop.time.replace("Z", ""));
                     let time = LocalTime.of(d.hour(), d.minute(), d.second());
                     return Builder(Stop)
                        .name(stop.name)
                        .time(time)
                        .position(stop.position)
                        .childs(CHILDS.map(x => Object.assign({}, x)))
                        .build();
                  }))
                  .build();
               backs.push(stopList);
            }

            // finally build the Line
            return Builder(Line)
               .id(line._id)
               .lineName(line.name)
               .adminEmail(line.admin_email)
               .outward(outwards)
               .back(backs)
               .build();
         });
      }
      return of(this.lines);
   }

   getLineById(id) {
      return this.line_db.find(line => line._id == id);
   }

   getReservationByLineAndDate(line_id, date) {

   }
}
