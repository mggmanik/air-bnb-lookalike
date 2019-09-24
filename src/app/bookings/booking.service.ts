import {Injectable} from '@angular/core';
import {Booking} from "./booking.model";

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private _bookings: Booking[] = [
        {
            id: 'xyz',
            placeId: 'p1',
            placeTitle: 'Kasauli Resorts',
            guestNumber: 2,
            userId: 'abc'
        }
    ];

    constructor() {
    }


    get bookings(): Booking[] {
        return [...this._bookings];
    }
}
