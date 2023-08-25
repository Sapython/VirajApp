import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { ReplaySubject, Subject } from 'rxjs';
import { UserBusiness } from '../../types/user.structure';
import { Menu } from '../../types/menu.structure';

@Injectable({
  providedIn: 'root'
})
export class DataProvider {

  constructor() {
    this.routeChanged.subscribe((route)=>{
      if (route != 'sales'){
        this.selectMainOutlet();
      }
    })
  }
  loggedIn:boolean = false;
  loggedInSubject:Subject<boolean> = new Subject<boolean>();;
  currentBusiness:ReplaySubject<UserBusiness> = new ReplaySubject<UserBusiness>();
  menuLoadedSubject:ReplaySubject<Menu> = new ReplaySubject<Menu>();
  currentSettings:ReplaySubject<any> = new ReplaySubject<any>();
  routeChanged:ReplaySubject<string> = new ReplaySubject<string>();
  loading:boolean = false;
  currentUser:User|undefined;
  allBusiness:UserBusiness[] = [];
  selectedMenu:Menu|undefined;

  selectMainOutlet(){
    this.currentBusiness.next(this.allBusiness[0]);
  }

  public businessData:any;
}
