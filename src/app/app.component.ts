import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges{
  title = 'angular-bootstrap-autocomplete';
  selectedState: string;
  selectedCity: string;
  states = [];
  cities = [];
  jsonData:any;
  model:any
  public stateSearch: any;
  public citySearch: any;
  constructor(private data: DataService){
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    // this.selectState();
    // this.selectCities();
  }
 
  ngOnInit() {
    this.data.getData().subscribe(res => {
       this.jsonData = res['states'];
      this.jsonData.forEach(ele => {
           return this.states.push(ele.state);
          });
    })
     this.selectState();
    this.selectCities();
  }

  selectState(){
    this.stateSearch = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? this.states 
        : this.states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  }

  setState(e: NgbTypeaheadSelectItemEvent){
    this.cities= [];
     this.selectedState = e.item
     this.jsonData.forEach(element => {
        if(element.state === e.item){
         for(let eachVal of element.districts){
          this.cities.push(eachVal);
         }
        }      
     });
     e.item = '';
   }

  selectCities(){
    this.citySearch = (text$: Observable<any>) => 
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>  term.length < 2 ? this.cities : 
        this.cities.filter(value => value.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  }

  keyup(event){
    if(!event.target.value){
      this.selectedState = event;
        setTimeout(()=>{
          this.model = '';  
        }, 200);
      
    }
  }

  setCity(e: NgbTypeaheadSelectItemEvent){
    this.selectedCity = e.item;
  }
}
