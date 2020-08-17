import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { UsersService } from "../../services/users.service";
import { UsersModel } from 'src/app/models/users.model';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public registerForm: FormGroup;

  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  msgs: any[];
  modalRegister: boolean;
  public iUser = new UsersModel();
  public iUserReg = new UsersModel();
  public isPassword: string;

  //Login Form
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  //Register Form
  get name() { return this.registerForm.get('name'); }
  get gender() { return this.registerForm.get('gender'); }
  get correo() { return this.registerForm.get('correo'); }
  get status() { return this.registerForm.get('status'); }
  get passwordreg() { return this.registerForm.get('passwordreg'); }
  
  constructor(
      private authService: AuthService, 
      private usersService: UsersService, 
      private router: Router,
      private messageService: MessageService,
      private ngxService: NgxUiLoaderService) { }

  createLoginForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('', [Validators.required])
    });
  }

  createRegisterForm() {
    return new FormGroup({
      id: new FormControl('', []),
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      passwordreg: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
    this.registerForm = this.createRegisterForm();
    this.msgs = [{ severity: 'info', detail: 'UserName: admin' }, { severity: 'info', detail: 'Password: password' }];
    this.authService.logout();
  }

  login() {
    this.ngxService.start();    
    this.authService.login(this.iUser).subscribe(response => {
      this.ngxService.stop();
      if (response.IsSuccess) {
        this.router.navigate(['/']);
      } else {
        this.showWarning('Usuario o contraseña incorrectos');
      }
    });
    
  }

  register() {
    
    this.ngxService.start();

    this.usersService.registergorest(this.iUserReg).subscribe(response => {
      console.log(response);
      //if (response['code'] === 200 || response['code'] === 201) {
      if (response.code === 200 || response.code === 201) {
        
        this.iUserReg.user_id = response.data['id'];

        this.usersService.register(this.iUserReg).subscribe(result => {

          this.registerForm.reset();
          this.modalRegister = false;

          if (result.IsSuccess) {
            this.showSuccess('Se ha registrado satisfactoriamente.');
          } else {
            //Eliminar el usuario de gorest
            this.showError('Ha ocurrido un error al registrarse, por favor intente nuevamente.');
          }
        });
        
      } else {
        let messageError: string = 'Ha ocurrido lo siguiente: \n\n';
        response.data.forEach(item => {
          messageError =  messageError + ` Campo: ${ item.field }, Mensaje: ${ item.message }`;
        });
        this.showError(messageError);
      }

      this.ngxService.stop();
    });

    
  }

  showSuccess(message: string) {
    this.messageService.add({severity:'success', summary: 'Bien hecho', detail: message});
  }

  showError(message: string) {
    this.messageService.add({severity:'error', summary: 'Algo no va bien', detail: message});
  }

  showWarning(message: string) {
    this.messageService.add({severity:'warning', summary: 'Vaya', detail: message});
  }

}
