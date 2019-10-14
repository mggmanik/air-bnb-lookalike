import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PlacesService} from "../../places.service";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";

// function base64toBlob(base64Data, contentType) {
//     contentType = contentType || '';
//     const sliceSize = 1024;
//     const byteCharacters = atob(base64Data);
//     const bytesLength = byteCharacters.length;
//     const slicesCount = Math.ceil(bytesLength / sliceSize);
//     const byteArrays = new Array(slicesCount);
//
//     for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
//         const begin = sliceIndex * sliceSize;
//         const end = Math.min(begin + sliceSize, bytesLength);
//
//         const bytes = new Array(end - begin);
//         for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
//             bytes[i] = byteCharacters[offset].charCodeAt(0);
//         }
//         byteArrays[sliceIndex] = new Uint8Array(bytes);
//     }
//     return new Blob(byteArrays, {type: contentType});
// }

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    const ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], {type: mimeString});
    return blob;

}

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
            }),
            image: new FormControl(null)
        })
    }

    onImagePicked(imageData: string | File) {
        let imageFile;
        if (typeof imageData === 'string') {
            try {
                // imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
                imageFile = dataURItoBlob(imageData);
            } catch (e) {
                console.log(e);
                return;
            }
        } else {
            imageFile = imageData;
        }
        this.form.patchValue({image: imageFile});
    }

    onCreateOffer() {
        if (!this.form.valid || !this.form.get('image').value) {
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
