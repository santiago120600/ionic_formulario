import { Component } from '@angular/core';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    session;

  constructor(
      private restService : RestService
  ) {
    this.restService.authUserData().then(result=>{
        this.session = result;
        console.log(this.session);
    })
  }

  close_sess(){
      this.restService.logout();
  }

}
