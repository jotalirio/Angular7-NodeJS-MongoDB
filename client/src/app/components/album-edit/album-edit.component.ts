import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { UserService } from '../../services/user.service';
import { AlbumService } from '../../services/album.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'album-edit',
  templateUrl: '../album-add/album-add.component.html',
  providers: [UserService, AlbumService, UploadService]
})
export class AlbumEditComponent implements OnInit {
  
  public sectionTitle: string;
  public artist: Artist;
  public album: Album;
  public url: string;
  public saveErrorMessage;
  public saveSuccessMessage;
  public identity;
  public token;
  filesToLoad: Array<File>;
  isEdit: boolean;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _albumService: AlbumService,
     private _uploadService: UploadService
  ) {
     this.sectionTitle = 'Edit album'; 
     this.url = GLOBAL.base_url;
     this.artist = new Artist('', '', '');
     this.album = new Album('', '', 2019, '', '');
     this.isEdit = true;
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('album-edit.component.ts is loaded');
      // Get the album from database using the album's _id 
      this.getAlbum();
  }

  /**
   * @description This method fetchs an album's info by id
   */
  getAlbum() {
    // Retrieving the Album's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id)
      .subscribe( 
        // Response callback
        (res) => {
          if (!res.album) {
            console.log('Something went wrong fetching the album to edit.');
            this._router.navigate(['/']);
          }
          else {
            this.album = res.album;
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
   * @description This method edits an album's info
   */
  onSubmitAlbum() {
    console.log(this.album);
    // Retrieving the Album's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id']
      this._albumService.update(this.token, id, this.album)
      .subscribe(
        // Response callback
        (res) => {
          console.log(res);
          if (!res.albumUpdated) {
            this.saveErrorMessage = 'Something went wrong updating the album.';
          }
          else {
            this.saveSuccessMessage = "The album '" + this.album.title + "' was updated successfully.";
            if (!this.filesToLoad) {
              this._router.navigate(['/artist', res.albumUpdated.artist]); // Artist's id
            }
            else {
              // Upload the Album's profile image
              let urlPost = this.url + 'upload-image-album/' + id; 
              this._uploadService.doFileRequest(urlPost, [], this.filesToLoad, this.token)
                  .then(
                    (result) => {
                      this._router.navigate(['/artist', res.albumUpdated.artist]); // Artist's id
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
  fileChangeEvent(fileInput: any) {
    // We recover the files choosen at the input file
    this.filesToLoad = <Array<File>>fileInput.target.files;
    console.log(this.filesToLoad);
  }

}
