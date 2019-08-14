import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data=[];
  private dataSource= new BehaviorSubject(this.data);
  currentData=this.dataSource.asObservable();
  constructor() {}
  changeData(data:Array<any>){
    this.dataSource.next(data);
    this.data=data;
  }
}
