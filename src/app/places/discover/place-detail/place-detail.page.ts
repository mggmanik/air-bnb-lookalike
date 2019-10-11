import {Component, OnInit} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    ModalController,
    NavController
} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {PlacesService} from "../../places.service";
import {Place} from "../../place.model";
import {CreateBookingComponent} from "../../../bookings/create-booking/create-booking.component";
import {BookingService} from "../../../bookings/booking.service";
import {AuthService} from "../../../auth/auth.service";
import {switchMap, take} from "rxjs/operators";

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

    place: Place;
    isBookable = false;

    constructor(private route: ActivatedRoute,
                private navCtrl: NavController,
                private placesService: PlacesService,
                private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController,
                private bookingService: BookingService,
                private authService: AuthService,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private router: Router) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/discover')
                return;
            }
            const placeId = paramMap.get('placeId');
            let fetchedUserId: string;
            this.authService.userId.pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('Found no user!');
                    }
                    fetchedUserId = userId;
                    return this.placesService.getPlace(placeId);
                })
            ).subscribe(place => {
                    this.place = place;
                    this.isBookable = place.userId !== fetchedUserId;
                },
                error => {
                    this.alertCtrl.create({
                        header: 'An Error Occurred!',
                        message: 'The place does not exist! Please try again later.',
                        buttons: [
                            {
                                text: 'Okay',
                                handler: () => {
                                    this.router.navigateByUrl('/places/tabs/discover');
                                }
                            }
                        ]
                    })
                        .then(alertEl => {
                            alertEl.present();
                        })
                });
        })
    }

    onBook() {
        // this.navCtrl.navigateBack('/places/tabs/discover');
        this.actionSheetCtrl.create({
            header: 'Choose an Option',
            buttons: [
                {
                    text: 'Select Date',
                    handler: () => {
                        this.openBookingModel("select")
                    }
                },
                {
                    text: 'Random Date',
                    handler: () => {
                        this.openBookingModel("random")
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        }).then(actionSheetEl => {
            actionSheetEl.present()
        })
    }

    openBookingModel(mode: 'select' | 'random') {
        this.modalCtrl.create({
            component: CreateBookingComponent,
            componentProps: {
                selectedPlace: this.place,
                selectedMode: mode
            }
        }).then(modalEl => {
            modalEl.present();
            return modalEl.onDidDismiss()
        }).then(resultData => {
            if (resultData.role == 'cancel') {
                return;
            }
            const data = resultData.data.bookingData;
            if (resultData.role === 'confirm') {
                this.loadingCtrl.create({
                    message: 'Booking Place...'
                }).then(loadingEl => {
                    loadingEl.present();
                    this.bookingService.addBooking(
                        this.place.id,
                        this.place.title,
                        this.place.imageUrl,
                        data.firstName,
                        data.lastName,
                        data.guestNumber,
                        data.startDate,
                        data.endDate
                    ).subscribe(() => {
                        loadingEl.dismiss();
                        this.router.navigateByUrl('/bookings')
                    })
                });
            }
        })
    }
}
