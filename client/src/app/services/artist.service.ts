// Imports necessary to create the Service
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

// We are using the @Injectable decorator in order to be possible to inject this service in another place of our application
@Injectable()
export class ArtistService {
    public url: string;

    // We are using dependency injection for to use the 'Http' service
    constructor(private _http: Http) {
        this.url = GLOBAL.base_url;
    }

    /**
     * @description We are using this method to request the 'getArtist' Rest API service in order to retrieve an artist from the database
     * @param token User's token
     * @param id Artist's id
     * @returns json object
     */
    getArtist(token, id: string) {
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url + 'artist/' + id, options)
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'getArtists' Rest API service in order to retrieve artists from the database
     * @param token User's token
     * @param page Pagination page
     * @returns json object
     */
    getArtists(token, page) {
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url + 'artists/' + page, options)
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'saveArtist' Rest API service in order to create a new artist in the application
     * @param artistToSave Artist info to be saved in the application's database
     * @returns json object
     */
    save(token, artistToSave: Artist) {
      // We transform the javascript object a String JSON object
      let jsonString = JSON.stringify(artistToSave);
      let params = jsonString;
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      // We transform the response in a json object
      return this._http.post(this.url + 'artist', params, {headers: headers})
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'updateArtist' Rest API service in order to edit an artist's profile in the application
     * @param artistToUpdate Artist info to be updated in the application's database
     * @returns json object
     */
    update(token, id: string, artistToUpdate: Artist) {
      // We transform the javascript object a String JSON object
      let jsonString = JSON.stringify(artistToUpdate);
      let params = jsonString;
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });
      // We transform the response in a json object
      return this._http.put(this.url + 'update-artist/' + id, params, {headers: headers})
                       .pipe(map(res => res.json()));
  }

    /**
     * @description We are using this method to request the 'deleteArtist' Rest API service in order to delete an artist from the database
     * @param token User's token
     * @param id Artist's id
     * @returns json object
     */
    delete(token, id: string) {
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.delete(this.url + 'delete-artist/' + id, options)
                       .pipe(map(res => res.json()));
    }

}
