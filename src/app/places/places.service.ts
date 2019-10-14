import {Injectable} from '@angular/core';
import {Place} from "./place.model";
import {AuthService} from "../auth/auth.service";
import {BehaviorSubject, of} from "rxjs";
import {map, switchMap, take, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

interface PlaceData {
    availableFrom: string;
    availableTo: string;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})

// new Place(
//     'p1',
//     'Manhatton Mansion',
//     'In the heart of NYC!!',
//     'https://thenypost.files.wordpress.com/2017/04/mansion7.jpg?quality=90&strip=all&w=978&h=652&crop=1',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
// ),
//     new Place(
//         'p2',
//         'The Taj Hotel',
//         'In the heart of Mumbai',
//         'https://upload.wikimedia.org/wikipedia/commons/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg',
//         249.99,
//         new Date('2019-01-01'),
//         new Date('2019-12-31'),
//         'xyz'
//     ),
//     new Place(
//         'p3',
//         'Kasauli Resorts',
//         'In the heart of Himachal',
//         'http://www.hotelkasauliresort.com/images/Homepage_Resort_INDEX/top-slider-img2.jpg',
//         99.99,
//         new Date('2019-01-01'),
//         new Date('2019-12-31'),
//         'abc'
//     )

export class PlacesService {

    private _places = new BehaviorSubject<Place[]>([]);

    constructor(private authService: AuthService, private http: HttpClient) {
    }

    get places() {
        return this._places.asObservable();
    }

    fetchPlaces() {
        return this.http
            .get <{ [key: string]: PlaceData }>('https://ionic-angular-course-18a8b.firebaseio.com/offered-places.json')
            .pipe(map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(new Place(
                                key,
                                resData[key].title,
                                resData[key].description,
                                resData[key].imageUrl,
                                resData[key].price,
                                new Date(resData[key].availableFrom),
                                new Date(resData[key].availableTo),
                                resData[key].userId
                            ))
                        }
                    }
                    return places;
                }),
                tap(places => {
                    this._places.next(places);
                })
            );
    }

    getPlace(placeId: string) {
        return this.http.get<PlaceData>(`https://ionic-angular-course-18a8b.firebaseio.com/offered-places/${placeId}.json`)
            .pipe(
                map(placeData => {
                    return new Place(
                        placeId,
                        placeData.title,
                        placeData.description,
                        placeData.imageUrl,
                        placeData.price,
                        new Date(placeData.availableFrom),
                        new Date(placeData.availableTo),
                        placeData.userId
                    )
                })
            );
    }

    uploadImage(image: File) {
        const uploadData = new FormData();
        uploadData.append('image', image);

        return this.http.post<{ imageUrl: string, imagePath: string }>('https://us-central1-ionic-angular-course-18a8b.cloudfunctions.net/storeImage', uploadData);
    }

    addPlace(title: string, description: string, price: number, imageUrl: string, dateFrom: Date, dateTo: Date) {
        let generatedId: string;
        let newPlace: Place;
        return this.authService.userId.pipe(take(1), switchMap(userId => {
                if (!userId) {
                    throw new Error("User not found!");
                }
                newPlace = new Place(
                    Math.random().toString(),
                    title,
                    description,
                    imageUrl,
                    price,
                    dateFrom,
                    dateTo,
                    userId
                );
                return this.http.post<{ name: string }>('https://ionic-angular-course-18a8b.firebaseio.com/offered-places.json',
                    {
                        ...newPlace,
                        id: null
                    });
            }), switchMap(resData => {
                generatedId = resData.name;
                return this.places;
            }),
            take(1),
            tap(places => {
                newPlace.id = generatedId;
                this._places.next(places.concat(newPlace))
            })
        );
    }

    updatePlace(placeId: string, title: string, description: string) {
        let updatedPlaces: Place[];
        return this.places.pipe(
            take(1),
            switchMap(places => {
                if (!places || places.length <= 0) {
                    return this.fetchPlaces();
                } else {
                    return of(places);
                }
            }),
            switchMap(places => {
                const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
                updatedPlaces = [...places];
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
                return this.http.put(`https://ionic-angular-course-18a8b.firebaseio.com/offered-places/${placeId}.json`,
                    {...updatedPlaces[updatedPlaceIndex], id: null})
            }),
            tap(() => {
                this._places.next(updatedPlaces);
            })
        )
            ;
    }
}
