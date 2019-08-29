import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'artist-detail',
  templateUrl: './artist-detail.component.html',
  providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
  public artist: Artist;
  public url: string;
  public identity;
  public token;
  albums: Album[];
  message: string;
  confirmed: string;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _artistService: ArtistService,
     private _albumService: AlbumService
  ) {
     this.url = GLOBAL.base_url;
     this.artist = new Artist('', '', '');
     this.confirmed = null;
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('artist-details.component.ts is loaded');
      // Get the artist from database using the artist's _id 
      this.getArtist();
  }

  public getArtist() {
    // Retrieving the Artist's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistService.getArtist(this.token, id)
      .subscribe( 
        // Response callback
        (res) => {
          if (!res.artist) {
            this._router.navigate(['/']);
          }
          else {
            this.artist = res.artist;
            // Fetching the Artit's albums
            this._albumService.getAlbums(this.token, res.artist._id)
            .subscribe( 
              // Response callback
              (res) => {
                if (!res.albums) {
                  this.message = "There are no albums for this artist.";
                }
                else {
                  this.albums = res.albums;
                  console.log(this.albums);
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

  onDeleteConfirm(id) {
    this.confirmed = id;
  }

  onCancelDeleteAlbum() {
    this.confirmed = null;
  }

  onDeleteAlbum(id) {
    this._albumService.delete(this.token, id)
    .subscribe( 
      // Response callback
      (res) => {
        if (!res.album) {
          alert("ERROR on Server.");
        }
        // Refreshing the artist list
        this.getArtist();
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