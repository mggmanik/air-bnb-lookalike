import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PlacesService} from "../../places.service";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";

@Component({
    selector: 'app-new-offer',
    templateUrl: './new-offer.page.html',
    styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

    form: FormGroup;

    constructor(private placesService: PlacesService,
                private router: Router,
                private loadingCtrl: LoadingController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            description: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
            }),
            price: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
            }),
            dateFrom: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            dateTo: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            })
        })
    }

    onCreateOffer() {
        if (!this.form.valid) {
            return;
        }
        const formValue = this.form.value;
        this.loadingCtrl.create({
            message: 'Creating Offer...'
        }).then(loadingEl => {
            loadingEl.present();
            this.placesService.addPlace(
                formValue.title,
                formValue.description,
                +formValue.price,
                new Date(formValue.dateFrom),
                new Date(formValue.dateTo)
            ).subscribe(() => {
                loadingEl.dismiss();
                this.form.reset();
                this.router.navigateByUrl("/places/tabs/offers");
            });
        });
    }

}
