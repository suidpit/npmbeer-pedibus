import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StopService {

    stopsObserver$: Subject<any[][]> = new BehaviorSubject(undefined);

    size;
    stops;

    initialize(stops, width, small) {
        let size;
        if(small){
            size = 90;
        }else{
            size = 180;
        }
        this.stops = stops;
        this.updateRows(width, size);
    }

    updateRows(width, size) {
        let stopsRowsTemp = [];
        for (let i = 0; i < this.stops.length; i++) {
            stopsRowsTemp.push([]);
            let index = 0;
            stopsRowsTemp[i].push([]);
            //first time there will be the start so I can consider 3 rounded elements instead of 2 (round is half of start)
            let available = width - 3*(size/2);
            for (let s of this.stops[i]) {
                if(available-size<0 && stopsRowsTemp[i][index].length>0){
                    stopsRowsTemp[i].push([]);
                    index++;
                    available = width - size;
                }
                stopsRowsTemp[i][index].push(s);
                available-=size;
            }

            if((available-(size/2)<0)){
                //new row
                stopsRowsTemp[i].push([]);
            }
        }
        if (stopsRowsTemp.length == 0) {
            this.stopsObserver$.next(undefined);
        }else{
            this.stopsObserver$.next(stopsRowsTemp);
        }
    }

    unsubscribe() {
        this.stopsObserver$.next(undefined);
    }
}
