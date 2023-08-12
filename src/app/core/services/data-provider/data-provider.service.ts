import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { User } from '@angular/fire/auth';
import { ReplaySubject, Subject } from 'rxjs';
import { UserBusiness } from '../../types/user.structure';
import { Menu } from '../../types/menu.structure';

@Injectable({
  providedIn: 'root'
})
export class DataProvider {

  constructor() { }
  loggedIn:boolean = false;
  loggedInSubject:Subject<boolean> = new Subject<boolean>();;
  currentBusiness:ReplaySubject<UserBusiness> = new ReplaySubject<UserBusiness>();
  menuLoadedSubject:ReplaySubject<Menu> = new ReplaySubject<Menu>();
  loading:boolean = false;
  currentUser:User|undefined;
  allBusiness:UserBusiness[] = [];
  selectedMenu:Menu|undefined;

  public businessData:any;
}
