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

    
  result_posts: PostsModel[];

  public liPosts: PostsModel[];

  sortKey: string;
  
  notEmptyPost = true;
  notscrolly = true;
  limit: number = 0;

  constructor(
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService,
    private postsService: PostsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    
    this.limit = 5;
    this.getpostsAll();

  }

  getpostsAll() {
    
    this.ngxService.start();

    this.postsService.getpostsAll(5).subscribe(response => {
      if (response.IsSuccess) {
        this.liPosts = response.Data;
      } else {
        this.showError('Ha ocurrido un error al consultar los posts');
      }

      this.ngxService.stop();
    });

  }
  
  onScroll() {
    
    this.spinner.show();
    this.notscrolly = false;
    this.loadNextPost();

  }

  loadNextPost() {
    this.limit = this.limit + 5;

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
