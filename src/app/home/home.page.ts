import { Component } from '@angular/core';
import { RestService } from '../services/rest.service';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validator,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    public citaForm: FormGroup;
    session;
    form_sent = false;

  constructor(
      private restService : RestService,
      private formBuilder: FormBuilder,
  ) {
    this.restService.authUserData().then(result=>{
        this.session = result;
        console.log(this.session);
    })


    this.citaForm = this.formBuilder.group({
      pName: new FormControl("", Validators.compose([Validators.required])),
      pDoc: new FormControl("", Validators.compose([Validators.required])),
      pDate: new FormControl("", Validators.compose([Validators.required])),
      pTime: new FormControl("", Validators.compose([Validators.required])),
      pPadecimiento: new FormControl("", Validators.compose([Validators.required])),
      pNotes: new FormControl("", Validators.compose([Validators.required]))
    } )
  }

  close_sess(){
      this.restService.logout();
  }


 save_cita() {
    this.form_sent = true;
    if (this.citaForm.invalid) {
      return;
    } else {
        //si es valido registrar
        this.restService.cita(this.citaForm.value);
      }
    }
  

}
