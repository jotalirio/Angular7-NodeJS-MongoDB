import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Song } from '../../models/song';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'song-edit',
  templateUrl: '../song-add/song-add.component.html',
  providers: [UserService, UploadService, SongService]
})
export class SongEditComponent implements OnInit {
  
  public sectionTitle: string;
  public song: Song;
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
     private _songService: SongService,
     private _uploadService: UploadService
  ) {
     this.sectionTitle = 'Edit song'; 
     this.url = GLOBAL.base_url;
     this.song = new Song(1, '', '', '', '');
     this.isEdit = true;
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('song-edit.component.ts is loaded');
      // Get the song from database using the song's _id 
      this.getSong();
  }

  /**
   * @description This method fetchs a song's info by id
   */
  getSong() {
    // Retrieving the Song's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._songService.getSong(this.token, id)
      .subscribe( 
        // Response callback
        (res) => {
          if (!res.song) {
            console.log('Something went wrong fetching the song to edit.');
            this._router.navigate(['/']);
          }
          else {
            this.song = res.song;
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
   * @description This method edits an song's info
   */
  onSubmitSong() {
    console.log(this.song);
    // Retrieving the Song's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id']
      this._songService.update(this.token, id, this.song)
      .subscribe(
        // Response callback
        (res) => {
          console.log(res);
          if (!res.songUpdated) {
            this.saveErrorMessage = 'Something went wrong updating the song.';
          }
          else {
            this.saveSuccessMessage = "The song '" + this.song.name + "' was updated successfully.";
            if (!this.filesToLoad) {
              this._router.navigate(['/album', res.songUpdated.album]); // Album's id
            }
            else {
              // Upload the Song's profile song file
              let urlPost = this.url + 'upload-file-song/' + id; 
              this._uploadService.doFileRequest(urlPost, [], this.filesToLoad, this.token)
                  .then(
                    (result) => {
                      this._router.navigate(['/album', res.songUpdated.album]); // Album's id
                    },
                    (error) => {
                      console.log(error);
                    }
                  )
                  .catch((e) => {
                    console.log('Something went wrong to upload the sound file to the server ' + e);
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
    console.log("Files to upload...");
    console.log(this.filesToLoad);
  }

}
