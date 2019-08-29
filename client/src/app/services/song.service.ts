// Imports necessary to create the Service
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Song } from '../models/song';

// We are using the @Injectable decorator in order to be possible to inject this service in another place of our application
@Injectable()
export class SongService {
    public url: string;

    // We are using dependency injection for to use the 'Http' service
    constructor(private _http: Http) {
        this.url = GLOBAL.base_url;
    }

    /**
     * @description We are using this method to request the 'getSong' Rest API service in order to retrieve a song from the database
     * @param token User's token
     * @param id Song's id
     * @returns json object
     */
    getSong(token, id: string) {
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url + 'song/' + id, options)
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'getSongs' Rest API service in order to retrieve an album's songs from the database
     * @param token User's token
     * @param page Pagination page
     * @returns json object
     */
    getSongs(token, album_id) { 
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url + 'songs/' + album_id, options)
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'saveSong' Rest API service in order to create a new album's song in the application
     * @param songToSave Song info to be saved in the application's database
     * @returns json object
     */
    save(token, songToSave: Song) {
      // We transform the javascript object a String JSON object
      let jsonString = JSON.stringify(songToSave);
      let params = jsonString;
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      // We transform the response in a json object
      return this._http.post(this.url + 'song', params, {headers: headers})
                       .pipe(map(res => res.json()));
    }

    /**
     * @description We are using this method to request the 'updateSong' Rest API service in order to edit an album's song in the application
     * @param songToUpdate Song info to be updated in the application's database
     * @returns json object
     */
    update(token, id: string, songToUpdate: Song) {
      // We transform the javascript object a String JSON object
      let jsonString = JSON.stringify(songToUpdate);
      let params = jsonString;
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });
      // We transform the response in a json object
      return this._http.put(this.url + 'update-song/' + id, params, {headers: headers})
                       .pipe(map(res => res.json()));
  }

    /**
     * @description We are using this method to request the 'deleteSong' Rest API service in order to delete a song from the database
     * @param token User's token
     * @param id Song's id
     * @returns json object
     */
    delete(token, id: string) {
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });
      let options = new RequestOptions({headers: headers});
      return this._http.delete(this.url + 'delete-song/' + id, options)
                       .pipe(map(res => res.json()));
    }

}
