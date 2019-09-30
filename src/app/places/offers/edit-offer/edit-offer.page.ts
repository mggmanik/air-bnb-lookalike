import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavController} from "@ionic/angular";
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
    form: FormGroup;

    constructor(private route: ActivatedRoute,
                private navCtrl: NavController,
                private placesService: PlacesService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers')
                return;
            }
            const placeId = paramMap.get('placeId');
            this.offer = this.placesService.getPlace(placeId);
            this.form = new FormGroup({
                title: new FormControl(this.offer.title, {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }),
                description: new FormControl(this.offer.description, {
                    updateOn: 'blur',
                    validators: [Validators.required, Validators.maxLength(180)]
                })
            })
        })
    }

    onEditOffer() {
        if (!this.form.valid) {
            return;
        }
        console.log(this.form);
    }

}
