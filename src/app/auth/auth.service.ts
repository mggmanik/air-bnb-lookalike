import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _userIsAuthenticated = true;
    private _userId;

    constructor() {
    }

    get userIsAuthenticated(): boolean {
        return this._userIsAuthenticated;
    }

    get userId() {
        return this._userId;
    }

    login() {
        this._userIsAuthenticated = true;
    }

    logout() {
        this._userIsAuthenticated = false;
    }
}
