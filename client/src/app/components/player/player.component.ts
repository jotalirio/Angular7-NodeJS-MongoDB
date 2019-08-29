import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'player',
  templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {

  public song: Song;
  public url: string;

  constructor() {
     this.url = GLOBAL.base_url;
     this.song = new Song(1, '', '', '', '');
  }

  ngOnInit() {
      console.log('player.component.ts is loaded');

      let song = JSON.parse(localStorage.getItem('sound_song'));
      if(song) {
        this.song = song;
        console.log(this.song);
      }
  }

}
