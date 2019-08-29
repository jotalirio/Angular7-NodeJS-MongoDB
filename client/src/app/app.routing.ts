import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumAddComponent } from './components/album-add/album-add.component'
import { AlbumEditComponent } from './components/album-edit/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { SongAddComponent } from './components/song-add/song-add.component'
import { SongEditComponent } from './components/song-edit/song-edit.component';

// Defining the routes
const appRoutes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'artists/1',
    //     pathMatch: 'full'
    // },
    // { path: '', component: ArtistListComponent }, // Default component to be loaded
    { path: '', component: HomeComponent }, // Default component to be loaded
    { path: 'artists/:page', component: ArtistListComponent }, //Artist route with pagination
    { path: 'add-artist', component: ArtistAddComponent }, //Add artist route 
    { path: 'edit-artist/:id', component: ArtistEditComponent }, //Edit artist route 
    { path: 'artist/:id', component: ArtistDetailComponent }, //Detail artist route 
    { path: 'add-album/:artist_id', component: AlbumAddComponent }, //Add album route 
    { path: 'edit-album/:id', component: AlbumEditComponent }, //Edit album route 
    { path: 'album/:id', component: AlbumDetailComponent }, //Detail album route 
    { path: 'add-song/:album_id', component: SongAddComponent }, //Add song route 
    { path: 'edit-song/:id', component: SongEditComponent }, //Edit song route 
    { path: 'my-profile', component: UserEditComponent }, //User info route
    { path: '**', component: HomeComponent } // Component to be loaded when there is not a route for the path indicated
];

export const appRoutingProviders: any[] = []; // Our routes provider
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes); // Our router
