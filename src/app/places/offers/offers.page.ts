import {Component, OnInit} from '@angular/core';
import {PlacesService} from "../places.service";
import {Place} from "../place.model";
import {IonItemSliding, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-offers',
    templateUrl: './offers.page.html',
    styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

    offers: Place[];

    constructor(private placesService: PlacesService,
                private router: Router,
                private loadingCtrl: LoadingController) {
    }

    ngOnInit() {
        this.placesService.places.subscribe(offers => {
            this.offers = offers;
        });
    }

    ionViewWillEnter() {
        this.loadingCtrl.create({message: 'Fetching...'})
            .then(loadingEl => {
                loadingEl.present();
                this.placesService.fetchPlaces().subscribe(() => {
                    loadingEl.dismiss();
                });
            })
    }

    onEditOffer(offerId: string, itemSliding: IonItemSliding) {
        itemSliding.close();
        this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    }
}
