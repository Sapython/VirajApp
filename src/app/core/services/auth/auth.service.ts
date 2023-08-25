import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, signInWithCustomToken, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, Timestamp, arrayUnion, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { DataProvider } from '../data-provider/data-provider.service';
import { UserRecord } from '../../types/user.structure';
import { Router } from '@angular/router';
import { AlertsAndNotificationsService } from '../alerts-and-notification/alerts-and-notifications.service';
const debug:boolean = false;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signInWithUserAndPasswordFunction = httpsCallable(
    this.functions,
    'signInWithUserAndPassword'
  );
  private signUpWithUserAndPasswordFunction = httpsCallable(
    this.functions,
    'signUpWithUserAndPassword'
  );
  private checkUsernameFunction = httpsCallable(this.functions, 'userNameAvailable');
  private authenticateActionFunction = httpsCallable(this.functions, 'authenticateAction');
  private addExistingUserFunction = httpsCallable(this.functions, 'addExistingUser');
  private verifyOtpExistingUserFunction = httpsCallable(this.functions, 'verifyOtpExistingUser');
  constructor(private functions: Functions,private auth:Auth,private dataProvider:DataProvider,private firestore:Firestore,private router:Router,private alertify:AlertsAndNotificationsService) {
    this.dataProvider.loading = true;
    onAuthStateChanged(this.auth, async (user) => {
      console.log("USER changed",user);
      if (user) {
        this.dataProvider.currentUser = user;
        this.dataProvider.loading = false;
        this.dataProvider.loggedIn = true;
        this.dataProvider.loggedInSubject.next(true);
        console.log("Already logged in",this.dataProvider);
        this.router.navigate(['/admin/activity']);
        let tempUser = (await this.getUser(user.uid)).data();
        if (!tempUser){
          return
        }
        console.log("tempUser",tempUser);
        if (tempUser && tempUser['username'] && tempUser['business'] && tempUser['business'].length > 0){
          let userDocData:UserRecord = {
            business: tempUser['business'],
            lastLogin: tempUser['lastLogin'],
            username: tempUser['username']
          };
          if (userDocData.business.length > 0) {
            this.dataProvider.allBusiness = this.filteredBusiness(userDocData.business);
            if (this.dataProvider.allBusiness.length == 0){
              alert("No business found under this user.")
              this.dataProvider.currentUser = undefined;
              this.dataProvider.loading = false;
              this.dataProvider.loggedIn = false;
              this.dataProvider.loggedInSubject.next(false);
              this.logOut();
              this.router.navigate(['/login']);
              return;
            } else {
              this.dataProvider.currentBusiness.next(this.dataProvider.allBusiness[0]);
            }
          } else {
            alert("No business found under this user.")
          }
        } else {
          alert("This user type is old and has been deprecated. Please contact support.")
        }
      } else {
        this.dataProvider.currentUser = undefined;
        this.dataProvider.loading = false;
        this.dataProvider.loggedIn = false;
        this.dataProvider.loggedInSubject.next(false);
      }
    })
  }

  async signUpWithUserAndPassword(
    username: string,
    password: string,
    params:{
      business: {
        access: { accessType: 'role', role:string, lastUpdated:Timestamp; updatedBy: string } | 
        { accessType: 'custom',propertiesAllowed:string[], lastUpdated:Timestamp; updatedBy: string };
        address: string;
        businessId: string;
        joiningDate: Timestamp;
        name: string;
      },
      email: string,
      phone?: string,
      image?: string,
      noSignIn?: boolean,
    }
  ) {
    this.dataProvider.loading = true;
    try {
      if (
        typeof username != 'string' ||
        !username ||
        username.length < 4 ||
        username.length > 20
      ) {
        throw new Error('Username must be between 4 and 20 characters');
      }
      if (
        typeof password != 'string' ||
        !password ||
        password.length < 4 ||
        password.length > 20
      ) {
        throw new Error('Password must be between 8 and 20 characters');
      }
      // check if userId exists
      let uidDoc = await getDoc(doc(this.firestore, 'users/' + username));
      if (uidDoc.exists()) {
        throw new Error('Username already exists');
      }
      // check for fields {business,email (optional), image (optional), phone (optional), username}
      if (!username || !password) {
        throw new Error('Missing fields. Username and password are required');
        // return { error: 'Missing fields' }
      }
      if (!params.business) {
        // return { error: 'Missing fields' }
        throw new Error('Missing fields. Business is required');
      }
      let additionalClaims: any = {
        business: [],
        providerId: 'custom',
      };
      if (params.email) {
        if (typeof params.email !== 'string' || !params.email.includes('@')) {
          throw new Error('Email is invalid');
        }
        additionalClaims['email'] = params.email;
      }
      if (params.image) {
        if (typeof params.image !== 'string' || !params.image.includes('http')) {
          throw new Error('Image url is invalid');
        }
        additionalClaims['image'] = params.image;
      }
      if (params.phone) {
        if (typeof params.phone !== 'string' || params.phone.length !== 10) {
          throw new Error('Phone number is invalid');
        }
        additionalClaims['phone'] = params.phone;
      }
      if (params.business) {
        if (
          typeof params.business !== 'object' ||
          !params.business.access ||
          !params.business.address ||
          !params.business.businessId ||
          !params.business.joiningDate ||
          !params.business.name
        ) {
          throw new Error('Business is invalid');
        }
        additionalClaims['business'] = [params.business];
      } else {
        throw new Error('Business is required');
      }
      // create user
      let data = {
        username,
        password,
        email:params.email,
        phone:params.phone,
        image:params.image,
        business:params.business,
        providerId:'custom',
      }
      let signUpRequest = await this.signUpWithUserAndPasswordFunction(data) as any;
      if (signUpRequest.data['token']){
        return signUpRequest.data;
      } else {
        console.log(signUpRequest);
        if (signUpRequest.data['error']){
          throw new Error(signUpRequest.data['error'])
        } else if(signUpRequest.data['errorInfo']) {
          throw new Error(signUpRequest.data['errorInfo']['message'])
        }
      }
    } catch (error) {
    //  console.log(error);
      throw error;
    } finally {
      this.dataProvider.loading = false;
    }
  }
  
  async signInWithUserAndPassword(username: string, password: string) {
    if (typeof(username) !='string' || !username || username.length < 4 || username.length > 20) {
      throw new Error('Username must be between 4 and 20 characters');
    }
    if (typeof(password) !='string' || !password || password.length < 4 || password.length > 20) {
        throw new Error('Password must be between 8 and 20 characters');
    }
    // get user document
    let userDoc = await getDoc(doc(this.firestore,'users',username));
    if (!userDoc.exists()){
      this.alertify.presentToast("User not found. Please sign up first.")
      throw new Error("User not found. Please sign up first.")
    }
    let signInRequest:any = await this.signInWithUserAndPasswordFunction({username, password});
    if (!userDoc.data()['business'] || userDoc.data()['business'].length == 0){
      this.alertify.presentToast("No business found under this user with admin access. Please contact support.")
      throw new Error("No business found under this user with admin access. Please contact support.")
    }
    let validBusinesses = this.filteredBusiness(userDoc.data()['business']);
    if(validBusinesses.length == 0){
      this.alertify.presentToast("No business found under this user with admin access. Please contact support.")
      throw new Error("No business found under this user with admin access. Please contact support.")
    }
    this.dataProvider.allBusiness = validBusinesses;
    return this.loginWithCustomToken(signInRequest.data['token'])
  }

  loginWithEmailPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signInWithCustomToken(token: string) {
    window.localStorage.setItem('signInToken', token);
    return signInWithCustomToken(this.auth, token);
  }

  loginWithCustomToken(token: string) {
    window.localStorage.setItem('signInToken', token);
    return signInWithCustomToken(this.auth, token);
  }

  getUser(userId:string){
    return getDoc(doc(this.firestore,'users',userId));
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['/login']);
    return signOut(this.auth);
  }

  async checkUsernameAvailability(username:string){
    return this.checkUsernameFunction({username});
  }

  async authenticateAction(action:string){
    // let response = await this.authenticateActionFunction({username:userCredentials.username,password:userCredentials.password,businessId:this.dataProvider.currentBusiness.businessId})
  }

  async addExistingUser(username:string,businessId:string,access:{accessType:'role',role:string}|{accessType:'custom',propertiesAllowed:string[]}){
    return this.addExistingUserFunction({username,businessId,...access,currentUser:this.dataProvider.currentUser!.uid});
  }

  async verifyOtpExistingUser(username:string,otp:string,authId:string){
    return this.verifyOtpExistingUserFunction({username,otp:otp.toString(),authId})
  }

  private filteredBusiness(business:any[]){
    return business.filter((business:any)=>{
      if(business.access.accessLevel == 'admin' || (business.access.accessType == 'role' && business.access.role == 'admin')){
        return true;
      } else {
        return false;
      }
    });
  }
}
