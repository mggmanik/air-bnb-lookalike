import {Injectable} from '@angular/core';
import {Place} from "./place.model";

@Injectable({
    providedIn: 'root'
})
export class PlacesService {

    private _places: Place[] = [
        new Place(
            'p1',
            'Manhatton Mansion',
            'In the heart of NYC!!',
            'https://thenypost.files.wordpress.com/2017/04/mansion7.jpg?quality=90&strip=all&w=978&h=652&crop=1',
            149.99
        ),
        new Place(
            'p2',
            'The Taj Hotel',
            'In the heart of Mumbai',
            'https://upload.wikimedia.org/wikipedia/commons/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg',
            249.99
        ),
        new Place(
            'p3',
            'Kasauli Resorts',
            'In the heart of Himachal',
            'http://www.hotelkasauliresort.com/images/Homepage_Resort_INDEX/top-slider-img2.jpg',
            99.99
        )
    ];

    get places(): any[] {
        return [...this._places];
    }

    getPlace(id: string) {
        return {...this._places.find(p => p.id === id)};
    }

    constructor() {
    }
}
