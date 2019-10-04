import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, LoadingController, NavController} from "@ionic/angular";
import {PlacesService} from "../../places.service";
import {Place} from "../../place.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-edit-offer',
    templateUrl: './edit-offer.page.html',
    styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

    offer: Place;
    isLoading = false;
    form: FormGroup;

    constructor(private route: ActivatedRoute,
                private navCtrl: NavController,
                private placesService: PlacesService,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private router: Router) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers');
                return;
            }
            this.isLoading = true;
            const placeId = paramMap.get('placeId');
            this.loadingCtrl.create({message: 'Loading...'})
                .then(loadingEl => {
                    loadingEl.present();
                    this.placesService.getPlace(placeId).subscribe(offer => {
                            this.offer = offer;
                            this.form = new FormGroup({
                                title: new FormControl(this.offer.title, {
                                    updateOn: 'blur',
                                    validators: [Validators.required]
                                }),
                                description: new FormControl(this.offer.description, {
                                    updateOn: 'blur',
                                    validators: [Validators.required, Validators.maxLength(180)]
                                })
                            });
                            this.isLoading = false;
                            loadingEl.dismiss();
                        },
                        error => {
                            this.alertCtrl.create({
                                header: 'An Error Occurred !!',
                                message: 'Place could not be fetched! Please try again later.',
                                buttons: [
                                    {
                                        text: 'Okay',
                                        handler: () => {
                                            this.router.navigateByUrl('/places/tabs/offers');
                                        }
                                    }
                                ]
                            })
                                .then(alertEl => {
                                    loadingEl.dismiss();
                                    alertEl.present();
                                })
                        });
                })
        })
    }

    onEditOffer() {
        if (!this.form.valid) {
            return;
        }
        this.loadingCtrl.create({
            message: 'Updating Place...'
        }).then(loadingEl => {
            loadingEl.present();
            this.placesService.updatePlace(
                this.offer.id,
                this.form.value.title,
                this.form.value.description
            ).subscribe(() => {
                loadingEl.dismiss();
                this.form.reset();
                this.router.navigateByUrl("/places/tabs/offers");
            });
        });
    }

}
