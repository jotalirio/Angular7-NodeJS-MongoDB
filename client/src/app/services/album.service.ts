// Imports necessary to create the Service
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Album } from '../models/album';

// We are using the @Injectable decorator in order to be possible to inject this service in another place of our application
@Injectable()
export class AlbumService {
    public url: string;

    // We are using dependency injection for to use the 'Http' service
    constructor(private _http: Http) {
        this.url = GLOBAL.base_url;
    }

    /**
     * @description We are using this method to request the 'getAlbum' Rest API service in order to retrieve an album from the database
     * @param token User's token
     * @param id Album's id
     * @returns json object
     */
    getAlbum(token, id: string) {
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url + 'album/' + id, options)
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'getAlbums' Rest API service in order to retrieve an artist's albums  or ALL the application's albums 
     * from the database
     * @param token User's token
     * @param page Pagination page
     * @returns json object
     */
    getAlbums(token, artist_id = null) { // default parameter value is null
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      // By default, ALL the app's albums
      let endpoint = this.url + 'albums';
      if (artist_id) {
        // An Artist's albums
        endpoint += '/' + artist_id
      }
      return this._http.get(endpoint, options)
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'saveAlbum' Rest API service in order to create a new artist's album in the application
     * @param albumToSave Album info to be saved in the application's database
     * @returns json object
     */
    save(token, albumToSave: Album) {
      // We transform the javascript object a String JSON object
      let jsonString = JSON.stringify(albumToSave);
      let params = jsonString;
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      // We transform the response in a json object
      return this._http.post(this.url + 'album', params, {headers: headers})
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'updateAlbum' Rest API service in order to edit an artis's album in the application
     * @param artistToUpdate Album info to be updated in the application's database
     * @returns json object
     */
    update(token, id: string, albumToUpdate: Album) {
      // We transform the javascript object a String JSON object
      let jsonString = JSON.stringify(albumToUpdate);
      let params = jsonString;
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });
      // We transform the response in a json object
      return this._http.put(this.url + 'update-album/' + id, params, {headers: headers})
                       .pipe(map(res => res.json()));
  }

    /**
     * @description We are using this method to request the 'deleteAlbum' Rest API service in order to delete an album from the database
     * @param token User's token
     * @param id Album's id
     * @returns json object
     */
    delete(token, id: string) {
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.delete(this.url + 'delete-album/' + id, options)
                       .pipe(map(res => res.json()));
    }

}
