import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import { ArtistService } from '../../services/artist.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'artist-edit',
  templateUrl: '../artist-add/artist-add.component.html',
  providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
  public title: string;
  public artist: Artist;
  public url: string;
  public saveErrorMessage;
  public saveSuccessMessage;
  public filesToLoad: Array<File>;
  public isEdit: boolean;
  public identity;
  public token;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _artistService: ArtistService,
     private _uploadService: UploadService
  ) {
     this.title = 'Edit artist'; 
     this.url = GLOBAL.base_url;
     this.artist = new Artist('', '', '');
     this.isEdit = true;
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('artist-edit.component.ts is loaded');
      // Get the artist from database using the artist's _id 
      this.getArtist();
  }

  /**
   * @description This method fetchs an artist's info by id
   */
  public getArtist() {
    // Retrieving the Artist's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistService.getArtist(this.token, id)
      .subscribe( 
        // Response callback
        (res) => {
          if (!res.artist) {
            console.log('Something went wrong fetching the artist to edit.');
            this._router.navigate(['/']);
          }
          else {
            this.artist = res.artist;
          }
        }, 
        // Error callback
        (error) => {
          var errorMessage = <any>error;
          if(errorMessage != null) {
            let body = JSON.parse(error._body);
            console.log(body.message);
          }
        });
    });
  }

  /**
   * @description This method edits an artist's info
   */
   public onSubmitArtist() {
    console.log(this.artist);
    // Retrieving the Artist's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id']
      this._artistService.update(this.token, id, this.artist)
      .subscribe(
        // Response callback
        (res) => {
          console.log(res);
          if (!res.artistUpdated) {
            this.saveErrorMessage = 'Something went wrong updating the artist.';
          }
          else {
            this.saveSuccessMessage = "The artist '" + this.artist.name + "' was updated successfully.";
            if (!this.filesToLoad) {
              this._router.navigate(['/artist', res.artistUpdated._id]);
            }
            else {
              // Upload the Artist's profile image
              let urlPost = this.url + 'upload-image-artist/' + id; 
              this._uploadService.doFileRequest(urlPost, [], this.filesToLoad, this.token)
                  .then(
                    (result) => {
                      this._router.navigate(['/artist', res.artistUpdated._id]);
                    },
                    (error) => {
                      console.log(error);
                    }
                  )
                  .catch((e) => {
                    console.log('Something went wrong to upload the image to the server ' + e);
                  });
           }
          }
        }, 
        // Error callback
        (err) => {
          if(err != null) {
            let body = JSON.parse(err._body);
            this.saveErrorMessage = body.message;
          }
        }
      );
    });
   }

  /**
   * @description This method will be used when the change event of the file input is fired
   * @param fileInput Represents the file choosen in the file input
   */
  public fileChangeEvent(fileInput: any) {
    // We recover the files choosen at the input file
    this.filesToLoad = <Array<File>>fileInput.target.files;
    console.log(this.filesToLoad);
  }
}