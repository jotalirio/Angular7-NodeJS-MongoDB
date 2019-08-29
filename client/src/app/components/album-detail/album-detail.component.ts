import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Album } from '../../models/album';
import { Song } from '../../models/song';
import { AlbumService } from '../../services/album.service';
import { SongService } from '../../services/song.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'album-detail',
  templateUrl: './album-detail.component.html',
  providers: [UserService, AlbumService, SongService]
})
export class AlbumDetailComponent implements OnInit {
  
  public album: Album;
  public url: string;
  public identity;
  public token;
  songs: Song[] = [];
  message: string;
  confirmed: string;

  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
     private _userService: UserService,
     private _albumService: AlbumService,
     private _songService: SongService
  ) {
     this.url = GLOBAL.base_url;
     this.album = new Album('', '', null, '', '');
     this.confirmed = null;
     // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
      console.log('album-details.component.ts is loaded');
      // Get the artist from database using the artist's _id 
      this.getAlbum();
  }

  getAlbum() {
    // Retrieving the Album's id from the URL's params
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id)
      .subscribe( 
        // Response callback
        (res) => {
          if (!res.album) {
            console.log('Something went wrong updating the album.');
            this._router.navigate(['/']);
          }
          else {
            this.album = res.album;
            console.log("Album info....");
            console.log(this.album);
            // Fetching the Album's songs
            this._songService.getSongs(this.token, res.album._id)
            .subscribe( 
              // Response callback
              (res) => {
                if (!res.songs) {
                  this.message = "There are no songs for this album.";
                }
                else {
                  this.songs = res.songs;
                  console.log(this.songs);
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

  onCancelDeleteSong() {
    this.confirmed = null;
  }

  onDeleteSong(id) {
    this._songService.delete(this.token, id)
    .subscribe( 
      // Response callback
      (res) => {
        if (!res.song) {
          alert("ERROR on Server.");
        }
        // Refreshing the album's songs
        this.getAlbum();
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

  startPlayer(song) {
    let songPlayer = JSON.stringify(song);
    let filePath = this.url + 'get-file-song/' + song.file;
    let imagePath = this.url + 'get-image-album/' + song.album.image;
    localStorage.setItem('sound_song', songPlayer);
    document.getElementById('mp3-source').setAttribute("src", filePath);
    (document.getElementById('player') as any).load();
    (document.getElementById('player') as any).play();
    document.getElementById('play-song-title').innerHTML = song.name;
    document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
    document.getElementById('play-image-album').setAttribute("src", imagePath);
  }
}
