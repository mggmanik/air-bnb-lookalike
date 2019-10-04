import {Component, OnInit} from '@angular/core';
import {BookingService} from "./booking.service";
import {Booking} from "./booking.model";
import {IonItemSliding, LoadingController} from "@ionic/angular";

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

    bookings: Booking[];

    constructor(private bookingService: BookingService, private loadingCtrl: LoadingController) {
    }

    ngOnInit() {
        this.bookingService.bookings.subscribe(bookings =>
            this.bookings = bookings);
    }

    ionViewWillEnter() {
        this.bookingService.fetchBookings().subscribe();
    }

    onDeleteBooking(bookingId: string, itemSliding: IonItemSliding) {
        this.loadingCtrl.create({
            message: 'Cancelling...'
        }).then(loadingEl => {
            loadingEl.present();
            this.bookingService.cancelBooking(bookingId).subscribe(() => {
                itemSliding.close();
                loadingEl.dismiss();
            });
        });
    }

}
