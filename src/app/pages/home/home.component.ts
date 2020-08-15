import { Component, OnInit, ɵConsole } from '@angular/core';

import { PostsModel } from "../../models/posts.model";
import { Car } from "../../models/car.model";

import { CarService } from "../../services/car.service";
import { PostsService } from "../../services/posts.service";

import {LazyLoadEvent, SelectItem} from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [CarService]
})
export class HomeComponent implements OnInit {

  ipost = new PostsModel();

  cars: Car[];

  virtualCars: Car[];
  liPosts: PostsModel[];

  sortKey: string;

  sortOptions: SelectItem[];

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

    this.getposts();
  }

  getposts() {
    this.ngxService.start();
    this.postsService.getposts().subscribe(response => {
      
      if (response['_meta'].code === 200){        
        //console.log('resultado', response['result']);
        this.liPosts = response['result'];
        console.log('resultado', this.liPosts);
      }

      this.ngxService.stop();
      //   console.log(response['result']);
      // }
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
