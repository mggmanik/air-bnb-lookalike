import {Component, OnInit} from '@angular/core';
import {Place} from "../../place.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {PlacesService} from "../../places.service";

@Component({
    selector: 'app-offer-bookings',
    templateUrl: './offer-bookings.page.html',
    styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

    offer: Place;

    constructor(private route: ActivatedRoute,
                private navCtrl: NavController,
                private placesService: PlacesService
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers')
                return;
            }
            const placeId = paramMap.get('placeId');
            this.placesService.getPlace(placeId).subscribe(offer => {
                this.offer = offer;
            });
        })
    }

}
