import {Injectable} from '@angular/core';
import {Place} from "./place.model";
import {AuthService} from "../auth/auth.service";
import {BehaviorSubject} from "rxjs";
import {delay, map, take, tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class PlacesService {

    private _places = new BehaviorSubject<Place[]>([
        new Place(
            'p1',
            'Manhatton Mansion',
            'In the heart of NYC!!',
            'https://thenypost.files.wordpress.com/2017/04/mansion7.jpg?quality=90&strip=all&w=978&h=652&crop=1',
            149.99,
            new Date('2019-01-01'),
            new Date('2019-12-31'),
            'abc'
        ),
        new Place(
            'p2',
            'The Taj Hotel',
            'In the heart of Mumbai',
            'https://upload.wikimedia.org/wikipedia/commons/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg',
            249.99,
            new Date('2019-01-01'),
            new Date('2019-12-31'),
            'abc'
        ),
        new Place(
            'p3',
            'Kasauli Resorts',
            'In the heart of Himachal',
            'http://www.hotelkasauliresort.com/images/Homepage_Resort_INDEX/top-slider-img2.jpg',
            99.99,
            new Date('2019-01-01'),
            new Date('2019-12-31'),
            'abc'
        )
    ]);

    constructor(private authService: AuthService) {
    }

    get places() {
        return this._places.asObservable();
    }

    getPlace(id: string) {
        return this.places.pipe(take(1), map(places => {
                return places.find(p => p.id === id)
            })
        );
    }

    addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
        const newPlace = new Place(
            Math.random().toString(),
            title,
            description,
            'http://www.hotelkasauliresort.com/images/Homepage_Resort_INDEX/top-slider-img2.jpg',
            price,
            dateFrom,
            dateTo,
            this.authService.userId
        );
        return this.places.pipe(take(1), delay(1000), tap((places) => {
            this._places.next(places.concat(newPlace));
        }));
    }

    updatePlace(placeId: string, title: string, description: string) {
        return this.places.pipe(take(1), delay(1000), tap(places => {
            const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
            const updatedPlaces = [...places];
            const oldPlace = updatedPlaces[updatedPlaceIndex];
            updatedPlaces[updatedPlaceIndex] = new Place(
                oldPlace.id,
                title,
                description,
                oldPlace.imageUrl,
                oldPlace.price,
                oldPlace.availableFrom,
                oldPlace.availableTo,
                oldPlace.userId
            );
            this._places.next(updatedPlaces);
        }));
    }
}
