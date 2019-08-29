import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  providers: [UserService] //Here we load the services
})

export class UserEditComponent implements OnInit {
  public title: string;
  public userUpdate: User;
  public identity;
  public token;
  public url: string;
  public updateErrorMessage;
  public updateSuccessMessage;
  public filesToLoad: Array<File>;


  constructor(
      private _userService: UserService
  ) {
      this.title = 'Update my profile';
      this.url = GLOBAL.base_url;
      // localStorage
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.userUpdate = this.identity; // This way we fill the form with the user's profile
      console.log(this.userUpdate);
  }

  ngOnInit() {
      console.log('user-edit.component.ts is loaded');
  }

  /**
   * @description This method update the user's info
   */
  public onSubmitUpdate() {
    this._userService.update(this.userUpdate).subscribe(
      // Response callback
      (res) => {
        // Remember that updateUser is returning the old user's info in the response, not the new one
        let updated = res.user;
        if(!updated) {
          this.updateErrorMessage = 'Something went wrong updating your profile';
        }
        else {
          localStorage.setItem('identity', JSON.stringify(this.userUpdate));
          document.getElementById("identity-name").innerHTML = this.userUpdate.name;
          // Uploading the image to the server
          if(!this.filesToLoad) {
            // Redirect
          }
          else {
            let urlPost = this.url + 'upload-image-user/' + this.userUpdate._id; 
            this.doFileRequest(urlPost, [], this.filesToLoad)
                .then((result: any) => {
                  // Save the image in the userUpdate object
                  this.userUpdate.image = result.image;
                  // We need to do another localStorage to save the user's info with the image setted when the asynchronous POST request ends
                  localStorage.setItem('identity', JSON.stringify(this.userUpdate));
                  let imagePath = this.url + 'get-image-user/' + this.userUpdate.image;
                  document.getElementById("image-logged").setAttribute('src', imagePath);
                })
                .catch((e) => {
                  console.log('Something went wrong to upload the image to the server ' + e);
                });
          }
          this.updateSuccessMessage = 'Your profile has been updated correctly.';
        }
      }, 
      // Error callback
      (err) => {
        if(err != null) {
          let body = JSON.parse(err._body);
          this.updateErrorMessage = body.message;
        }
      }
    );
  }

  /**
   * @description This method will be used when the change event of the file input is fired
   * @param fileInput Represents the file choosen in the file input
   */
  public fileChangeEvent(fileInput: any) {
    // We recover the files choosen at the input file
    this.filesToLoad = <Array<File>>fileInput.target.files;
    console.log(this.filesToLoad);
  }
 
  /**
   * @description This method will be used to do a AJAX request to upload the files to the server
   * @param url Represents the URL needed for the AJAX Http POST request
   * @param params
   * @param files
   */
  public doFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      let xhr = new XMLHttpRequest();
      //Adding the files to the formData object
      for(let i=0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4){
          if(xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          }
          else {
            reject(xhr.response);
          }
        }  
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', this.token);
      xhr.send(formData);
    });
  }

}