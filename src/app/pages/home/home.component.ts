import { Component, OnInit, ɵConsole, EventEmitter, Output } from '@angular/core';
import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';

import { PostsModel } from "../../models/posts.model";

import { PostsService } from "../../services/posts.service";

import {LazyLoadEvent, SelectItem, MessageService} from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

//import { debug } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  
  public registerForm: FormGroup;
  ipost = new PostsModel();
  result_posts: PostsModel[];

  public liPosts: PostsModel[];

  sortKey: string;

  //sortOptions: SelectItem[];
  imageError: string;

  selectedFile: File = null;
  formData: FormData;

  public progress: number;
  public message: string;

  allpost;
  notEmptyPost = true;
  notscrolly = true;
  limit: number = 0;

  get title() { return this.registerForm.get('title'); }
  get body() { return this.registerForm.get('body'); }

  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    private ngxService: NgxUiLoaderService,
    private _http: HttpClient,
    private messageService: MessageService,
    private postsService: PostsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {          

    // this.sortOptions = [
    //     {label: 'Newest First', value: '!year'},
    //     {label: 'Oldest First', value: 'year'}
    // ];

    this.registerForm = this.createRegisterForm();
    this.limit = 5;
    this.getpostsAll();
    
  }

  getpostsAll() {
    this.ngxService.start();
    //this.liPosts = [];
    this.postsService.getpostsAll(5).subscribe(response => {
      if (response.IsSuccess) {
        this.liPosts = response.Data;
      } else {
        this.showError('Ha ocurrido un error al consultar los posts');
      }

      this.ngxService.stop();
    });

  }

  register() {
    
    this.ngxService.start();
    
    this.ipost.user_id = localStorage.getItem('user_id');

    this.postsService.register(this.ipost).subscribe(response => {
      
      //console.log(response);
      
      if (response.code === 200 || response.code === 201) {
        this.ipost.id_posts = response.data.id;
        this.postsService.insert(this.ipost).subscribe(result => {
          if (result.IsSuccess === true) {
            this.ipost = new PostsModel();
            this.registerForm.reset();
          } else {
            this.showError('Ha ocurrido un inconveniente al guardar su historia, por favor intente nuevamente.');
          }
        });
      } else {
        let messageError: string;
        response.data.forEach(item => {
          messageError =  messageError + ` Campo: ${ item.field }, Mensaje: ${ item.message }`;
        });
        this.showError(messageError);
        //console.log('Ha ocurrido un inconveniente', response);
      }

      this.ngxService.stop();

      if (response.code === 200 || response.code === 201){
        this.getpostsAll();
      }

    });
    
  }

  createRegisterForm() {
    return new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required])
    });
  }

  

  onFileSelected(event) {
    this.selectedFile = <File>event.target.file[0];
  }

  public uploadFile = (files) => {
    
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];    
    this.formData = new FormData()
    this.formData.append('file', fileToUpload, fileToUpload.name);

    //const jsonpost = JSON.stringify(this.ipost);    
    
    this._http.post(`${environment.apiURL}/posts/fileupload`, this.formData, { reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round(100 * event.loaded / event.total);
        }
        else {
          if (event.type === HttpEventType.Response) {
            this.message = 'Archivo subido exitosamente.';
            this.onUploadFinished.emit(event.body);
            this.ipost.url = `${environment.imgURL}/${fileToUpload.name}`;
          }
        }
        //console.log(event);
      });
  }

  onScroll() {
    
    this.spinner.show();
    this.notscrolly = false;
    this.loadNextPost();

    // if (this.notscrolly && this.notEmptyPost) {
    //   this.spinner.show();
    //   this.notscrolly = false;
    //   this.loadNextPost();
    // }
  }

  loadNextPost() {
    this.limit = this.limit + 5;
    //this.getpostsAll();

    this.postsService.getpostsAll(this.limit).subscribe(response => {
      if (response.IsSuccess) {
        this.liPosts = response.Data;        
      } else {
        this.showError('Ha ocurrido un error al consultar los posts');
      }
      this.spinner.hide();
    });
  }

  showSuccess(message: string) {
    this.messageService.add({severity:'success', summary: 'Bien hecho', detail: message});
  }

  showError(message: string) {
    this.messageService.add({severity:'error', summary: 'Algo no va bien', detail: message});
  }

}
