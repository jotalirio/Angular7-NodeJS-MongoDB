import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'album-add',
  templateUrl: './album-add.component.html',
  providers: [UserService, ArtistService, AlbumService]
})
export class AlbumAddComponent implements OnInit {
  
  public sectionTitle: string;
  public artist: Artist;
  public album: Album;
  public url: string;
  public saveErrorMessage;
  public saveSuccessMessage;
  public identity;
  public token;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _artistService: ArtistService,
     private _albumService: AlbumService
  ) {
     this.sectionTitle = 'Create new album'; 
     this.url = GLOBAL.base_url;
     this.artist = new Artist('', '', '');
     this.album = new Album('', '', 2019, '', '');
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('album-add.component.ts is loaded');

  }

   /**
   * @description This method saves a new album into the application
   */
  onSubmitAlbum() {
    // Retrieving the Artist's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let artist_id = params['artist_id'];
      this.album.artist = artist_id;
      console.log(this.album);
      this._albumService.save(this.token, this.album)
      .subscribe( 
        // Response callback
        (res) => {
          if (!res.album) {
            this.saveErrorMessage = 'Something went wrong creating the new album.';
          }
          else {
            this.album = res.album;
            this.saveSuccessMessage = "The new album '" + this.album.title + "' was created successfully.";
            this._router.navigate(['/edit-album', res.album._id]);
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
