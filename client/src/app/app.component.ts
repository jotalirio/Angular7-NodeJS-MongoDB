import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // In the metadata 'providers' we indicate the services to be used
  providers: [UserService]
})

// Implementing the OnInit interface
export class AppComponent implements OnInit {
  public title: string;
  public userLogin: User;
  public userRegister: User;
  public identity;
  public token;
  public loginErrorMessage;
  public registerErrorMessage;
  public registerSuccessMessage;
  public url: string;

  // We are using dependency injection for to use the user.service
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.title = 'MUSIFY';
    this.userLogin = new User('', '', '', '', '', 'ROLE_USER', '')
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.base_url;
    // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  /**
   * @description This method is provided for the OnInit interface and executes some code once the component has been loaded.
   */
  ngOnInit() {
    console.log('app.component.ts is loaded');     
  }

  /**
   * @description This method log in the user into the application and store the user's info inside the localStorage
   */
  public onSubmitLogin() {
    console.log(this.userLogin);
    // At the first time, were we are retrieving the user's info
    this._userService.signUp(this.userLogin).subscribe(
      // Response callback
      (res) => {
        let identitified = res.user;
        this.identity = identitified;
        if(!this.identity._id) {
          alert('The user is not identified correctly');
        }
        else {
          // We create a item inside the local storage browser to have the user info available
          localStorage.setItem('identity', JSON.stringify(identitified));
          // At the second time, we get the user's token to be used with every Http request
          this._userService.signUp(this.userLogin, 'true').subscribe(
            // Response callback
            (res) => {
              let token = res.token;
              this.token = token;
              if(!this.token || this.token.length <= 0) {
                alert("The user's token has not been generated correctly");
              }
              else {
                // We create a item inside the local storage browser to have the user's token info available
                localStorage.setItem('token', token);
                console.log(token);
                 // Reset the form fields
                this.userLogin = new User('', '', '', '', '', 'ROLE_USER', '')
              }
            }, 
            // Error callback
            (err) => {
              if(err != null) {
                let body = JSON.parse(err._body);
                this.loginErrorMessage = body.message;
              }
            }
          );
        }
      }, 
      // Error callback
      (err) => {
        if(err != null) {
          let body = JSON.parse(err._body);
          this.loginErrorMessage = body.message;
        }
      }
    );
  }

  /**
   * @description This method register the user into the application and store the user's info inside the localStorage
   */
  public onSubmitRegister() {
    console.log(this.userRegister);
    this._userService.register(this.userRegister).subscribe(
      // Response callback
      (res) => {
        let registered = res.user;
        this.userRegister = registered;
        if(!registered._id) {
          this.registerErrorMessage = 'Something went wrong registering the new user';
        }
        else {
          this.registerSuccessMessage = "The registration went successful. You can Log in with '" + this.userRegister.email + "'";
          // Reset the form fields
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      }, 
      // Error callback
      (err) => {
        if(err != null) {
          let body = JSON.parse(err._body);
          this.registerErrorMessage = body.message;
        }
      }
    );
  }

  /**
   * @description This method log out the user from the applicatio removing all the user's info from the localStorage
   */
  public logOut() {
    // We can remove one specific item from the localStorage
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    // Or remove all from the localStorate
    localStorage.clear();
    // In this way, we are showing the form Log ing and form Register to the user
    this.identity = null;
    this.token = null;
    //User is redirected to home URL (http://localhost:4200) when he logs out in the application
    this._router.navigate(['/']);
  }

}
