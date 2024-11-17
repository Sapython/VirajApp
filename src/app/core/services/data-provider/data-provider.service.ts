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
  currentBusiness:ReplaySubject<UserBusiness> = new ReplaySubject<UserBusiness>(1);
  menuLoadedSubject:ReplaySubject<Menu> = new ReplaySubject<Menu>(1);
  currentSettings:ReplaySubject<any> = new ReplaySubject<any>(1);
  routeChanged:ReplaySubject<string> = new ReplaySubject<string>(1);
  loading:boolean = false;
  currentUser:User|undefined;
  allBusiness:UserBusiness[] = [];
  selectedMenu:Menu|undefined;

  resetVariables(){
    this.loggedIn = false;
    this.loggedInSubject = new Subject<boolean>();
    this.currentBusiness = new ReplaySubject<UserBusiness>(1);
    this.menuLoadedSubject = new ReplaySubject<Menu>(1);
    this.currentSettings = new ReplaySubject<any>(1);
    this.routeChanged = new ReplaySubject<string>(1);
    this.loading = false;
    this.currentUser = undefined;
    this.allBusiness = [];
    this.selectedMenu = undefined;
  }

  selectMainOutlet(){
    this.currentBusiness.next(this.allBusiness[0]);
  }

  public businessData:any;
}
