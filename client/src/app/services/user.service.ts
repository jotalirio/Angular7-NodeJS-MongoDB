// Imports necessary to create the Service
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

// We are using the @Injectable decorator in order to be possible to inject this service in another place of our application
@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;

    // We are using dependency injection for to use the 'Http' service
    constructor(private _http: Http) {
        this.url = GLOBAL.base_url;
    }

    /**
     * @description We are using this method to request the 'loginUser' Rest API service in order to log in an user in the application
     * @param userToLogin Some user info necessary to log in the user in the application
     * @param gethash Its default value is 'null'. With true value, the method will return the token generated fot the user. Otherwise the user logged in will be return
     * @returns json object
     */
    signUp(userToLogin, gethash = null) {
        if(gethash != null) {
            // We are adding to the userToLogin the property gethash
            userToLogin.gethash = gethash;
        }
        // We transform the javascript object a String JSON object
        let jsonString = JSON.stringify(userToLogin);
        let params = jsonString;
        let headers = new Headers({'Content-Type':'application/json'});
        // We transform the response in a json object
        return this._http.post(this.url + 'login', params, {headers: headers})
                         .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'saveUser' Rest API service in order to register an user in the application
     * @param userToRegister User info to be saved in the application's database
     * @returns json object
     */
    register(userToRegister) {
        // We transform the javascript object a String JSON object
        let jsonString = JSON.stringify(userToRegister);
        let params = jsonString;
        let headers = new Headers({'Content-Type':'application/json'});
        // We transform the response in a json object
        return this._http.post(this.url + 'register', params, {headers: headers})
                         .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'updateUser' Rest API service in order to edit the user's profile in the application
     * @param userToUpdate User info to be updated in the application's database
     * @returns json object
     */
    update(userToUpdate) {
        // We transform the javascript object a String JSON object
        let jsonString = JSON.stringify(userToUpdate);
        let params = jsonString;
        let token = this.getToken();
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });
        // We transform the response in a json object
        return this._http.put(this.url + 'update-user/' + userToUpdate._id, params, {headers: headers})
                         .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to retrieve the Identity user info from browser localStorage property
     * @returns user's info
     */
    getIdentity() {
        let item = localStorage.getItem('identity');
        if(item != "undefined") {
            this.identity = JSON.parse(item);        
        }
        else {
            this.identity = null;
        }
        return this.identity;
    }

    /**
     * @description We are using this method to retrieve the user's token info from browser localStorage property
     * @returns user's token
     */
    getToken() {
        let item = localStorage.getItem('token');
        if(item != "undefined") {
            this.token = item;
        }
        else {
            this.token = null;
        }
        return this.token;
    }
}
