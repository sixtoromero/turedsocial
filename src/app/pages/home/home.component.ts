import { Component, OnInit } from '@angular/core';

import { PostsModel } from "../../models/posts.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ipost = new PostsModel();
  constructor() { }

  ngOnInit(): void {
    
  }

}
