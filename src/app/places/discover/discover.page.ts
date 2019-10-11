import {Component, OnInit} from '@angular/core';
import {PlacesService} from "../places.service";
import {Place} from "../place.model";
import {AuthService} from "../../auth/auth.service";
import {LoadingController} from "@ionic/angular";
import {take} from "rxjs/operators";

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

    places: Place[];
    relevantPlaces: Place[];

    constructor(private placesService: PlacesService,
                private authService: AuthService,
                private loadingCtrl: LoadingController) {
    }

    ngOnInit() {
        this.placesService.places.subscribe(places => {
            this.places = places;
            this.relevantPlaces = this.places;
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

    onFilterUpdate(event: CustomEvent) {
        this.authService.userId.pipe(take(1)).subscribe(userId => {
            if (event.detail.value === 'all') {
                this.relevantPlaces = this.places;
            } else {
                this.relevantPlaces = this.places.filter(place => place.userId !== userId);
            }
        });
    }

}
