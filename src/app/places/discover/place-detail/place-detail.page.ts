import {Component, OnInit} from '@angular/core';
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {PlacesService} from "../../places.service";
import {Place} from "../../place.model";
import {CreateBookingComponent} from "../../../bookings/create-booking/create-booking.component";

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

    place: Place;

    constructor(private route: ActivatedRoute,
                private navCtrl: NavController,
                private placesService: PlacesService,
                private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/discover')
                return;
            }
            const placeId = paramMap.get('placeId');
            this.placesService.getPlace(placeId).subscribe(place => {
                this.place = place;
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
        console.log(mode);
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
            console.log(resultData.data, resultData.role);
            if (resultData.role === 'confirm') {
                console.log('BOOKED!');
            }
        })
    }
}
