import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

    @ViewChild('map', {static: false}) mapElementRef: ElementRef;

    constructor(private modalCtrl: ModalController, private renderer: Renderer2) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getGoogleMaps()
            .then(googleMaps => {
                const mapEl = this.mapElementRef.nativeElement;
                const map = new googleMaps.Map(mapEl, {
                    center: {lat: 12.9247368, lng: 77.5993089},
                    zoom: 16
                });
                googleMaps.event.addListenerOnce(map, 'idle', () => {
                    this.renderer.addClass(mapEl, 'visible');
                });
            })
            .catch(err => {
                console.log(err);
            })
    }

    onCancel() {
        this.modalCtrl.dismiss();
    }

    private getGoogleMaps(): Promise<any> {
        const win = window as any;
        const googleModule = win.google;
        if (googleModule && googleModule.maps) {
            return Promise.resolve(googleModule.maps)
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhWbE0dPqm_R0lxRBF6OX_cu-NuIWU54';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => {
                const loadedGoogleModule = win.google;
                if (loadedGoogleModule && loadedGoogleModule.maps) {
                    resolve(loadedGoogleModule);
                } else {
                    reject('Google Maps SDK not available!');
                }
            };
        });
    }
}