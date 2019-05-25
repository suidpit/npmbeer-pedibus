import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  reservation_db = {

  }

  line_db = [
    {
       "_id":"5cdd97716178bd763090819e",
       "name":"linea2",
       "outward":[
          [
             {
                "name":"P.ta Susa",
                "time":            "2019-05-16T05:00:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"Vinzaglio",
                "time":            "2019-05-16T05:15:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"Poli",
                "time":            "2019-05-16T05:30:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             }
          ]
       ],
       "back":[
          [
             {
                "name":"Poli",
                "time":            "2019-05-16T09:30:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"Vinzaglio",
                "time":            "2019-05-16T09:45:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"P.ta Susa",
                "time":            "2019-05-16T10:00:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             }
          ],
          [
             {
                "name":"Poli",
                "time":            "2019-05-16T13:00:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"Vinzaglio",
                "time":            "2019-05-16T13:15:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"P.ta Susa",
                "time":            "2019-05-16T13:30:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             }
          ]
       ],
       "admin_email":"n@palm.beer",
       "_class":"it.polito.ai.pedibus.api.models.Line"
    },
    {
       "_id":"5cdd97716178bd763090819d",
       "name":"linea1",
       "outward":[
          [
             {
                "name":"P.za Solferino",
                "time":            "2019-05-16T05:00:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"P.za Castello",
                "time":            "2019-05-16T05:15:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"Sansa",
                "time":            "2019-05-16T05:30:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             }
          ]
       ],
       "back":[
          [
             {
                "name":"Sansa",
                "time":            "2019-05-16T09:30:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"P.za Castello",
                "time":            "2019-05-16T09:45:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             },
             {
                "name":"P.za Solferino",
                "time":            "2019-05-16T10:00:00Z",
                "position":{
                   "type":"Point",
                   "coordinates":[
                     46.24,
                     7.68
                   ]
                }
             }
          ],
          [
             {
                "name":"Sansa",
                "time":            "2019-05-16T13:00:00Z",
               "position":{
                 "type":"Point",
                 "coordinates":[
                   46.24,
                   7.68
                 ]
               }
             },
             {
                "name":"P.za Castello",
                "time":            "2019-05-16T13:15:00Z",
               "position":{
                 "type":"Point",
                 "coordinates":[
                   46.24,
                   7.68
                 ]
               }
             },
             {
                "name":"P.za Solferino",
                "time":            "2019-05-16T13:30:00Z",
               "position":{
                 "type":"Point",
                 "coordinates":[
                   46.24,
                   7.68
                 ]
               }
             }
          ]
       ],
       "admin_email":"admin@me.com",
       "_class":"it.polito.ai.pedibus.api.models.Line"
    }
  ]

  user_db = [
      {
       "_id":"5cdd97716178bd763090819f",
       "email":"n@palm.beer",
       "password":"$2a$10$A/hrVydgqrFBXFcW0aYBtubE8MYN5C/nGQTat3gOjOMwiwBGucJZK",
       "roles":[
          "USER",
          "SYSTEM_ADMIN"
       ],
       "authorities":[
          {
             "line_names":[
                "linea1"
             ],
             "authority":"SYSTEM_ADMIN"
          }
       ],
       "enabled":true,
       "_class":"it.polito.ai.pedibus.api.models.User"
    },
    {
       "_id":"5cdd98d16178bd76309081a0",
       "email":"dademanna@gmail.com",
       "password":"$2a$10$6sdwtCRALpAGZsh/9EYmL.923NuTvotc9o89X0yWUrMDc5WFrdQ62",
       "roles":[
          "USER"
       ],
       "authorities":[
          {
             "line_names":[

             ],
             "authority":"USER"
          },
          {
             "line_names":[
                "linea1",
                "linea2"
             ],
             "authority":"ADMIN"
          }
       ],
       "enabled":true,
       "_class":"it.polito.ai.pedibus.api.models.User"
    }
  ]


  constructor() { }
}
