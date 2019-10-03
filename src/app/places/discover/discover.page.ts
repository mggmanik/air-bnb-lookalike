import {Component, OnInit} from '@angular/core';
import {PlacesService} from "../places.service";
import {Place} from "../place.model";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

    places: Place[];
    relevantPlaces: Place[];

    constructor(private placesService: PlacesService, private authService: AuthService) {
    }

    ngOnInit() {
        this.placesService.places.subscribe(places => {
            this.places = places;
            this.relevantPlaces = this.places;
        });
    }

    onFilterUpdate(event: CustomEvent) {
        if (event.detail.value === 'all') {
            this.relevantPlaces = this.places;
        } else {
            this.relevantPlaces = this.places.filter(place => place.userId !== this.authService.userId);
        }
    }

}
