import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Song } from '../../models/song';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'song-add',
  templateUrl: './song-add.component.html',
  providers: [UserService, SongService]
})
export class SongAddComponent implements OnInit {
  
  public sectionTitle: string;
  public song: Song;
  public url: string;
  public saveErrorMessage;
  public saveSuccessMessage;
  public identity;
  public token;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _songService: SongService
  ) {
     this.sectionTitle = 'Create new song'; 
     this.url = GLOBAL.base_url;
     this.song = new Song(1, '', '', '', '');
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('song-add.component.ts is loaded');

  }

   /**
   * @description This method saves a new song into the application
   */
  onSubmitSong() {
    // Retrieving the Album's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let album_id = params['album_id'];
      this.song.album = album_id;
      console.log(this.song);
      this._songService.save(this.token, this.song)
      .subscribe( 
        // Response callback
        (res) => {
          if (!res.song) {
            this.saveErrorMessage = 'Something went wrong creating the new song.';
          }
          else {
            this.song = res.song;
            this.saveSuccessMessage = "The new song '" + this.song.name + "' was created successfully.";
            this._router.navigate(['/edit-song', res.song._id]);
          }
        }, 
        // Error callback
        (error) => {
          var errorMessage = <any>error;
          if(errorMessage != null) {
            let body = JSON.parse(error._body);
            this.saveErrorMessage =body.message;
          }
        });
    });
  }
}
