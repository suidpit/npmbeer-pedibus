import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { FormControl } from '@angular/forms';
import { LocalTime } from 'js-joda';

import { Child } from '../../models/child'
@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

    selectedLine = null;
    lines = null;
    selectedDate = null;
    selectedDirection = undefined;
    isMobile = false;
    selectedRun = undefined;

    /**
     * Filter passed to the date picker to filter out non-school days, i.e. sundays (0) and saturdays(6)
     * **/
    allowedDaysFilter = (d: Date): boolean => {
        const dayNum = d.getDay();
        return !(dayNum === 0 || dayNum === 6);
    };

    constructor(private dataService: DataService) {
        this.selectedDate = new FormControl(new Date());

        // check if it is a mobile user, if so, use touchUI elements for better targeting
        // see https://stackoverflow.com/a/25394023/6945436 for userAgent checking
        // TODO: check this on mobile, seems to work on desktop
        const userAgent = navigator.userAgent;
        this.isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
    }

    ngOnInit() {
        this.dataService.getLines().subscribe(lines => {
            this.selectedLine = lines[1];
            return this.lines = lines;
        });
        this.updateData();

    }

    updateData() {
        if (this.selectedLine != null) {
            if (this.selectedLine.outward[0].endsAt.isAfter(LocalTime.now()) || this.selectedDirection === 'outward') {
                this.selectedRun = 0;
            } else if (this.selectedLine.back[0].endsAt.isAfter(LocalTime.now())) {
                this.selectedRun = 1;
            } else if (this.selectedLine.back[1].endsAt.isAfter(LocalTime.now())) {
                this.selectedRun = 2;
            } else if (this.selectedDirection === 'back') {
                this.selectedRun = 1;
            } else {
                this.selectedRun = 0;
            }
        }
    }

    togglePresence(child: Child) {
        console.log(child)
        child.present = !child.present
    }
}
