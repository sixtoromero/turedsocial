import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsModel } from 'src/app/models/posts.model';
import {LazyLoadEvent, SelectItem, MessageService} from 'primeng/api';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { PostsService } from 'src/app/services/posts.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-createposts',
  templateUrl: './createposts.component.html',
  styleUrls: ['./createposts.component.scss'],
  providers: [MessageService]
})
export class CreatepostsComponent implements OnInit {

  public registerForm: FormGroup;
  @Output() public onUploadFinished = new EventEmitter();
  @Output() postsAll: EventEmitter<any>;
  
  selectedFile: File = null;
  ipost = new PostsModel();

  imageError: string;
  formData: FormData;

  public progress: number;
  public message: string;

  get title() { return this.registerForm.get('title'); }
  get body() { return this.registerForm.get('body'); }

  constructor(private _http: HttpClient,
              private ngxService: NgxUiLoaderService,
              private messageService: MessageService,
              private postsService: PostsService) { 
                this.postsAll = new EventEmitter();
              }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
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
        //Ejecutar función para llamar a getpostsAll
        //this.getpostsAll();
        this.getpostsAll();
      }

    });
    
  }

  showSuccess(message: string) {
    this.messageService.add({severity:'success', summary: 'Bien hecho', detail: message});
  }

  showError(message: string) {
    this.messageService.add({severity:'error', summary: 'Algo no va bien', detail: message});
  }

  getpostsAll(){
    this.postsAll.emit(null);
  }


}
