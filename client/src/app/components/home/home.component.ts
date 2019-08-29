import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  public title: string;
  
  constructor(
     private _route: ActivatedRoute,
     private _router: Router,
  ) {
     this.title = 'Welcome to MUSIFY'; 
     
  }

  ngOnInit() {
      console.log('home.component.ts is loaded');
  }

}