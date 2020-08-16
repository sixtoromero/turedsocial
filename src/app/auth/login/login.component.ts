import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { UsersService } from "../../services/users.service";
import { UsersModel } from 'src/app/models/users.model';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
  get first_name() { return this.registerForm.get('first_name'); }
  get last_name() { return this.registerForm.get('last_name'); }  
  get gender() { return this.registerForm.get('gender'); }
  get correo() { return this.registerForm.get('correo'); }
  get status() { return this.registerForm.get('status'); }
  get passwordreg() { return this.registerForm.get('passwordreg'); }
  
  constructor(
      private authService: AuthService, 
      private usersService: UsersService, 
      private router: Router,
      private ngxService: NgxUiLoaderService) { }

  createLoginForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('', [Validators.required])
    });
  }

  createRegisterForm() {
    return new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      passwordreg: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      id: new FormControl('', [])
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
      }
    });
    
  }

  register() {
    
    this.ngxService.start();

    this.usersService.registergorest(this.iUserReg).subscribe(response => {
      if (response['_meta'].code === 200) {

        console.log(response);
        
        this.iUserReg.user_id = response['result'].id;

        this.usersService.register(this.iUserReg).subscribe(result => {
          this.registerForm.reset();
          this.modalRegister = false;
        });
        
      }

      this.ngxService.stop();
    });

    
  }

}
