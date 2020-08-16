import { Component, OnInit, ɵConsole } from '@angular/core';

import { PostsModel } from "../../models/posts.model";
import { Car } from "../../models/car.model";

import { CarService } from "../../services/car.service";
import { PostsService } from "../../services/posts.service";

import {LazyLoadEvent, SelectItem} from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [CarService]
})
export class HomeComponent implements OnInit {

  
  public registerForm: FormGroup;
  ipost = new PostsModel();

  cars: Car[];

  virtualCars: Car[];
  liPosts: PostsModel[];

  sortKey: string;

  sortOptions: SelectItem[];

  get title() { return this.registerForm.get('title'); }
  get body() { return this.registerForm.get('body'); }  

  constructor(
    private carService: CarService,
    private ngxService: NgxUiLoaderService,
    private postsService: PostsService) { }

  ngOnInit(): void {
    this.cars = Array.from({length: 10000}).map(() => this.carService.generateCar());
    this.virtualCars = Array.from({length: 10000});

    this.sortOptions = [
        {label: 'Newest First', value: '!year'},
        {label: 'Oldest First', value: 'year'}
    ];

    this.registerForm = this.createRegisterForm();

    this.getposts();
  }

  getposts() {
    this.ngxService.start();
    this.postsService.getpostsByUserID().subscribe(response => {
      
      if (response['_meta'].code === 200){        
        //console.log('resultado', response['result']);
        this.liPosts = response['result'];
        //console.log('resultado', this.liPosts);
        this.postsService.getposts().subscribe(reg => {
          if (reg['_meta'].code === 200) {
            reg['result'].forEach(item => {
              this.liPosts.push(item);
            });
          }
        });
      }

      console.log('RESULTADO ALL', this.liPosts);
      this.ngxService.stop();
      //   console.log(response['result']);
      // }
    });
    
  }

  register() {
    
    this.ngxService.start();
    
    this.ipost.user_id = localStorage.getItem('user_id');

    this.postsService.register(this.ipost).subscribe(response => {
      if (response['_meta'].code === 200) {
        console.log('EURECA', response);
        this.registerForm.reset();
      } else {
        console.log('CARE NEA OME NEA', response);
      }

      this.ngxService.stop();
    });
    
  }

  createRegisterForm() {
    return new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required])
    });
  }


  loadCarsLazy(event: LazyLoadEvent) {       
    //simulate remote connection with a timeout 
      setTimeout(() => {
          //load data of required page
          let loadedCars = this.cars.slice(event.first, (event.first + event.rows));

          //populate page of virtual cars
          Array.prototype.splice.apply(this.virtualCars, [...[event.first, event.rows], ...loadedCars]);
          
          //trigger change detection
          this.virtualCars = [...this.virtualCars];
      }, 1000);
  }

  onSortChange() {
      if (this.sortKey.indexOf('!') === 0)
          this.sort(-1);
      else
          this.sort(1);
  }

  sort(order: number): void {
      let cars = [...this.cars];
      cars.sort((data1, data2) => {
          let value1 = data1.year;
          let value2 = data2.year;
          let result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

          return (order * result);
      });

      this.cars = cars;
  }

}
