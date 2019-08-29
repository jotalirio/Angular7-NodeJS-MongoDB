import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import { ArtistService } from '../../services/artist.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'artist-add',
  templateUrl: './artist-add.component.html',
  providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
  public title: string;
  public artist: Artist;
  public url: string;
  public saveErrorMessage;
  public saveSuccessMessage;
  public identity;
  public token;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _artistService: ArtistService
  ) {
     this.title = 'Create new artist'; 
     this.url = GLOBAL.base_url;
     this.artist = new Artist('', '', '');
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('artist-add.component.ts is loaded');
  }

  /**
   * @description This method saves a new artist into the application
   */
  public onSubmitArtist() {
    console.log(this.artist);
    this._artistService.save(this._userService.getToken(), this.artist)
    .subscribe(
      // Response callback
      (res) => {
        console.log(res);
        if (!res.artist) {
          this.saveErrorMessage = 'Something went wrong creating the new artist.';
        }
        else {
          this.artist = res.artist;
          this.saveSuccessMessage = "The new artist '" + this.artist.name + "' was created successfully.";
          this._router.navigate(['/edit-artist', res.artist._id]);
          //this._router.navigate(['/edit-artist/'+res.artist._id]);
          
          // Reset the form fields
          // this.artist = new Artist('', '', '');
          // Redirect to '/edit-artist'
          // this._router.navigate(['/edit-artist'], res._id);
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
  }

}