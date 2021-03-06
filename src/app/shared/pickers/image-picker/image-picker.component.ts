import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CameraResultType, CameraSource, Capacitor, Plugins} from "@capacitor/core";
import {Platform} from "@ionic/angular";

@Component({
    selector: 'app-image-picker',
    templateUrl: './image-picker.component.html',
    styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

    @ViewChild('filePicker', {static: false}) filePicker: ElementRef<HTMLInputElement>;
    @Output() imagePick = new EventEmitter<string | File>();
    selectedImage: string;
    usePicker = false;

    constructor(private platform: Platform) {
    }

    ngOnInit() {
        if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
            this.usePicker = true;
        }
    }

    onPickImage() {
        if (!Capacitor.isPluginAvailable('Camera')) {
            this.filePicker.nativeElement.click();
            return;
        }
        Plugins.Camera.getPhoto({
            quality: 50,
            source: CameraSource.Prompt,
            correctOrientation: true,
            height: 320,
            width: 600,
            resultType: CameraResultType.DataUrl
        }).then(image => {
            this.selectedImage = image.dataUrl;
            this.imagePick.emit(image.dataUrl);
        }).catch(error => {
            if (this.usePicker) {
                this.filePicker.nativeElement.click();
            }
            return false;
        });
    }

    onFileChosen(event: Event) {
        const pickedFile = (event.target as HTMLInputElement).files[0];
        if (!pickedFile) {
            return;
        }
        const fr = new FileReader();
        fr.onload = () => {
            const dataUrl = fr.result.toString();
            this.selectedImage = dataUrl;
            this.imagePick.emit(pickedFile);
        };
        fr.readAsDataURL(pickedFile);
    }
}
