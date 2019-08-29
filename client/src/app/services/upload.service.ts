// Imports necessary to create the Service
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

// We are using the @Injectable decorator in order to be possible to inject this service in another place of our application
@Injectable()
export class UploadService {
    public url: string;

    // We are using dependency injection for to use the 'Http' service
    constructor(private _http: Http) {
        this.url = GLOBAL.base_url;
    }

  /**
   * @description This method will be used to do a AJAX request to upload the files to the server
   * @param url Represents the URL needed for the AJAX Http POST request
   * @param params
   * @param files
   * @param token: The jwt token for HTTP Request to the API
   */
  public doFileRequest(url: string, params: Array<string>, files: Array<File>, token: string) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      let xhr = new XMLHttpRequest();
      //Adding the files to the formData object
      for(let i=0; i < files.length; i++) {
        formData.append('file', files[i], files[i].name);
      }
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4){
          if(xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          }
          else {
            reject(xhr.response);
          }
        }  
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
  
}
