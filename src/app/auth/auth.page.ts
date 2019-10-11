import {Component, OnInit} from '@angular/core';
import {AuthResponseData, AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

    isLogin = true;

    constructor(private authService: AuthService,
                private router: Router,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController) {
    }

    ngOnInit() {
    }

    authenticate(email: string, password: string) {
        this.loadingCtrl.create({
            message: 'Logging In...',
            keyboardClose: true
        }).then(loadingEl => {
            loadingEl.present();
            let authObs: Observable<AuthResponseData>;
            if (this.isLogin) {
                authObs = this.authService.login(email, password);
            } else {
                authObs = this.authService.signUp(email, password);
            }
            authObs.subscribe(resData => {
                    console.log(resData);
                    loadingEl.dismiss();
                    this.router.navigateByUrl('/places/tabs/discover');
                },
                errorRes => {
                    loadingEl.dismiss();
                    const code = errorRes.error.error.message;
                    let message = 'Could not Sign you up !';
                    if (code === 'EMAIL_EXISTS') {
                        message = 'This email address exists already!';
                    } else if (code === 'EMAIL_NOT_FOUND') {
                        message = 'Email Address not found!';
                    } else if (code === 'INVALID_PASSWORD') {
                        message = 'Invalid Password !'
                    }
                    this.showAlert(message);
                });
        });
    }

    onSwitchAuthMode() {
        this.isLogin = !this.isLogin;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        this.authenticate(email, password);
    }

    private showAlert(message: string) {
        this.alertCtrl.create({
            header: 'Authentication Failes',
            message: message,
            buttons: ['Okay']
        }).then(alertEl => {
            alertEl.present();
        })
    }

}
