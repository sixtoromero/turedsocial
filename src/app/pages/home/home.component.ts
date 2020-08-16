import { Component, OnInit, ɵConsole, EventEmitter, Output } from '@angular/core';
import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';

import { PostsModel } from "../../models/posts.model";

import { PostsService } from "../../services/posts.service";

import {LazyLoadEvent, SelectItem, MessageService} from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
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

  get title() { return this.registerForm.get('title'); }
  get body() { return this.registerForm.get('body'); }

  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    private ngxService: NgxUiLoaderService,
    private _http: HttpClient,
    private messageService: MessageService,
    private postsService: PostsService) { }

  ngOnInit(): void {          

    // this.sortOptions = [
    //     {label: 'Newest First', value: '!year'},
    //     {label: 'Oldest First', value: 'year'}
    // ];

    this.registerForm = this.createRegisterForm();
    this.getPostsByUser();

  }

  getPostsByUser() {
    this.postsService.getPostByUserID().subscribe(response => {
      if (response.IsSuccess) {
        this.result_posts = response.Data;
        this.getposts();
      }
    });
  }

  getposts() {
    this.ngxService.start();

    this.postsService.getpostsByUserID().subscribe(response => {
      //if (response['_meta'].code === 200) {
      if (response.code === 200) {
        this.liPosts = response.data;
        this.liPosts.forEach(post => {
          let result = this.result_posts.find(i => i.id_posts === post.id.toString())
          if (result !== null && result !== undefined) {
            post.url = result.url;
            post.isVisible = true;
          }
        });

        this.postsService.getposts().subscribe(reg => {
          if (reg.code === 200) {
            reg.data.forEach(item => {
              this.liPosts.push(item);
            });
          }
        });
      }
      this.ngxService.stop();
    },error => console.log(error));
    
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
            console.log('Mostrar mensaje avisando que no guardó');
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
        this.getposts();
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
    this.ipost.url = `${environment.imgURL}/${fileToUpload.name}`;
    
    this._http.post(`${environment.apiURL}/posts/fileupload`, this.formData, { reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Archivo subido exitosamente.';
          this.onUploadFinished.emit(event.body);          
        }
        console.log(event);
      });
  }

  showSuccess(message: string) {
    this.messageService.add({severity:'success', summary: 'Bien hecho', detail: message});
  }

  showError(message: string) {
    this.messageService.add({severity:'error', summary: 'Algo no va bien', detail: message});
  }

}
