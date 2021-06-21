import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {BehaviorSubject} from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  apiUrl = "http://localhost/examen_services_sw14/index.php/";
  private httpClientFiles: HttpClient;
  public authState =  new BehaviorSubject(false);

  constructor(
    private storage : Storage,
    private platform : Platform,
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController : LoadingController,
    private handler : HttpBackend
    ) {
      this.storage.create();
      this.platform.ready().then(()=>{
        this.isLoggedIn();
        this.httpClientFiles = new HttpClient(this.handler);
      });
  }

  async login(_data : any){
    const loading = await this.loadingController.create({
      message: 'Autenticando...'
    });
    await loading.present();
    console.info(this.apiUrl);
    return this.http.post<any>(this.apiUrl+"users/api/login_mobile",_data).subscribe(result =>{
      loading.dismiss();
      if(result.status == "success"){
          this.storage.set('ALMACEN_SESS',result.data);
          this.authState.next(true);
      }else if(result.status=="error"){
          this.display_toast('Error',"danger",result.message,'top',4000);
      }else{
          this.display_toast('Error',"danger","Error de comunicación, intente más tarde",'top',4000);
      }
    },(err) => {
      console.info(err);
      this.display_toast('Error',"danger","Error de comunicación, intente más tarde",'top',4000);
      loading.dismiss();
    });
  }

  async cita(_data : any){
    const loading = await this.loadingController.create({
      message: 'Registrando...'
    });
    await loading.present();
    console.info(this.apiUrl);
    return this.http.post<any>(this.apiUrl+"users/api/cita",_data).subscribe(result =>{
      loading.dismiss();
      if(result.status_text == "success"){
          this.display_toast('Success',"success",result.message,'top',4000);
      }else if(result.status_text=="error"){
          this.display_toast('Error',"danger",result.message,'top',4000);
      }else{
          this.display_toast('Error',"danger","Error de comunicación, intente más tarde",'top',4000);
      }
    },(err) => {
      console.info(err);
      this.display_toast('Error',"danger","Error de comunicación, intente más tarde",'top',4000);
      loading.dismiss();
    });
  }


  post_method(_uri : string,_data : any){
    return this.http.post<any>(this.apiUrl+_uri,_data);
  }
  put_method(_uri : string, _data : any){
    return this.http.put<any>(this.apiUrl+_uri,_data);
  }
  get_method( _uri : string,_params : any){
    return this.http.get<any>(this.apiUrl+_uri,{params: _params});
  }
  delete_method( _uri : string,_params : any){
    return this.http.delete<any>(this.apiUrl+_uri,{params: _params});
  }

  async logout(){
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...'
    });
    await loading.present();
    loading.dismiss();
    localStorage.removeItem('token');
    this.storage.remove('ALMACEN_SESS');
    this.authState.next(false);
  }

  isLoggedIn(){
    this.storage.get('ALMACEN_SESS').then((response) => {
      if(response){
        this.authState.next(true);
      }
      /*prueba de sesión descomentar el else para pruebas*/
        /*else{
        let fake_session = {
          "nombre" : "X"
        }
        this.storage.set('ALMACEN_SESS',fake_session).then( (response) =>{
          this.authState.next(true);
        });
      }*/
    });
  }
  isAuthenticacated(){
    return this.authState.value;
  }

  authUserData(){
    return this.storage.get('ALMACEN_SESS');
  }

  //mensajes con toast
  async display_toast(_title,_type,_message,_position,_duration){
    const toast = await this.toastController.create({
      header: _title,
      message: _message,
      position: _position,
      color : _type,
      duration:  _duration,
      buttons: [
        {
          icon: 'close-circle',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}
