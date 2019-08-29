import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import { ArtistService } from '../../services/artist.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'artist-list',
  templateUrl: './artist-list.component.html',
  providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
  public title: string;
  public artists: Artist[];
  public identity;
  public token;
  public url: string;
  public next_page;
  public prev_page;
  confirmed: string;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _artistService: ArtistService
  ) {
     this.title = 'Artists'; 
     this.url = GLOBAL.base_url;
     this.next_page = 1;
     this.prev_page = 1;
     this.confirmed = null;
     // localStorage
     this.identity = this._userService.getIdentity();
     this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('artist-list.component.ts is loaded');
      // Getting the artist list
      this.getArtists();
  }

  public getArtists() {
    // Retrieving the Artist's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let page = +params['page']; // Using '+' we cast the value from string to a number
      if (!page) {
        page = 1;
      }
      else {
        this.next_page = page + 1;
        this.prev_page = page - 1;
        if (this.prev_page == 0) {
          this.prev_page = 1;
        }
        this._artistService.getArtists(this.token, page)
        .subscribe( 
          // Response callback
          (res) => {
            if (!res.artists) {
              this._router.navigate(['/']);
            }
            else {
              this.artists = res.artists;
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
      }
    });
  }

  onDeleteConfirm(id) {
    this.confirmed = id;
  }

  onCancelDeleteArtist() {
    this.confirmed = null;
  }

  onDeleteArtist(id) {
    this._artistService.delete(this.token, id)
    .subscribe( 
      // Response callback
      (res) => {
        if (!res.artist) {
          alert("ERROR on Server.");
        }
        // Refreshing the artist list
        this.getArtists();
      }, 
      // Error callback
      (error) => {
        var errorMessage = <any>error;
        if(errorMessage != null) {
          let body = JSON.parse(error._body);
          console.log(body.message);
        }
      });
  }
}