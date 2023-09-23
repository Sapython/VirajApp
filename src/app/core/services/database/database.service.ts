import { Injectable } from '@angular/core';
import { Firestore, getDocs, collection, DocumentData, getDoc, doc, addDoc, updateDoc, setDoc, collectionData, docData, deleteDoc, query, where, runTransaction } from '@angular/fire/firestore';
import { DataProvider } from '../data-provider/data-provider.service';
import { Menu } from '../../types/menu.structure';
import { Category } from '../../types/category.structure';
import { Tax } from '../../types/tax.structure';
import { CustomerInfo, UserBusiness } from '../../types/user.structure';
import { Subject, Subscription } from 'rxjs';
import { PaymentMethod } from '../../types/payment.structure';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  cachedData:any = {};
  settingsSub:Subscription = Subscription.EMPTY;
  users:Subject<UserBusiness[]> = new Subject<UserBusiness[]>();
  constructor(private dataProvider:DataProvider,private firestore:Firestore) {
    this.dataProvider.currentBusiness.subscribe((data)=>{
      this.settingsSub.unsubscribe();
      this.settingsSub = docData(doc(this.firestore,'business/' + data.businessId + '/settings/settings')).subscribe((settings:any)=>{
        this.dataProvider.currentSettings.next(settings);
      });
    })
  }

  resetVariables(){
    this.cachedData = {};
  }

  async getBusinessSetting(businessId: string){
    var businessSetting:any;
    if (!(this.cachedData[businessId] && this.cachedData[businessId]['businessSettings'])){
      businessSetting = (await getDoc(doc(this.firestore,'business/' + businessId + '/settings/settings'))).data();
    } else {
      return this.cachedData[businessId]['businessSettings'];
    }
    // this.cachedData[businessId]['businessSettings'] = businessSetting;
    if ((this.cachedData && this.cachedData[businessId])){
      this.cachedData[businessId]['businessSettings'] = businessSetting;
    }
    return businessSetting;
  }

  async updateBusinessSetting(businessId: string,businessSetting:any){
    await updateDoc(doc(this.firestore,'business/' + businessId + '/settings/settings'),{...businessSetting});
    if (this.cachedData[businessId]){
      this.cachedData[businessId]['businessSettings'] = businessSetting;
    }
  }

  resetUsers(businessId:string){
    this.cachedData[businessId]['users'] = undefined;
  }

  async getUsers(businessId:string){
    // retrieve users from path business/{{businessId}}
    var users:any[] = [];
    if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['users'])){
      let business = (await getDoc(doc(this.firestore,'business/' + businessId)));
      if(business.exists()){
        business.data()['users'].forEach((user:any)=>{
          users.push({
            id:user['username'],
            ...user
          });
        });
      }
    } else {
      return this.cachedData[businessId]['users'];
    }
    if (this.cachedData[businessId]){
      this.cachedData[businessId]['users'] = users;
    } else {
      this.cachedData[businessId] = {
        users: users
      }
    }
    return users;
  }

  async getPaymentMethods(businessId:string){
    // /business/uqd9dm0its2v9xx6fey2q/paymentMethods
    let paymentMethods = (await getDocs(collection(this.firestore,'business/' + businessId + '/paymentMethods'))).docs.map(doc => {return {id:doc.id,...doc.data()}}) as PaymentMethod[];
    return paymentMethods;
  }

  async addPaymentMethod(businessId:string,paymentMethod:any){
    paymentMethod = {
      ...paymentMethod,
      addDate:new Date(),
      updateDate:new Date()
    }
    await addDoc(collection(this.firestore,'business/' + businessId + '/paymentMethods'),paymentMethod);
    if (this.cachedData[businessId] && this.cachedData[businessId]['paymentMethods']){
      this.cachedData[businessId]['paymentMethods'].push(paymentMethod);
    } else {
      this.cachedData[businessId] = {
        paymentMethods: [paymentMethod]
      }
    }
  }


  async updatePaymentMethod(businessId:string,paymentMethod:any){
    await updateDoc(doc(this.firestore,'business/' + businessId + '/paymentMethods/' + paymentMethod.id),{...paymentMethod});
    if (this.cachedData[businessId] && this.cachedData[businessId]['paymentMethods']){
      let index = this.cachedData[businessId]['paymentMethods'].findIndex((p:any)=>{return p.id == paymentMethod.id});
      this.cachedData[businessId]['paymentMethods'][index] = paymentMethod;
    } else {
      this.cachedData[businessId] = {
        paymentMethods: [paymentMethod]
      }
    }
  }

  deletePaymentMethod(businessId:string,paymentMethodId:string){
    deleteDoc(doc(this.firestore,'business/' + businessId + '/paymentMethods/' + paymentMethodId));
    if (this.cachedData[businessId] && this.cachedData[businessId]['paymentMethods']){
      let index = this.cachedData[businessId]['paymentMethods'].findIndex((p:any)=>{return p.id == paymentMethodId});
      this.cachedData[businessId]['paymentMethods'].splice(index,1);
    }
  }

  async getRootSettings(businessId:string){
    return (await getDoc(doc(this.firestore,'business/' + businessId + '/settings/settings'))).data();
  }

  async updateRootSettings(settings:any,businessId:string){
    return setDoc(
      doc(this.firestore, 'business/' + businessId + '/settings/settings'),
      settings,
      { merge: true }
    );
  }
  
  async getCurrentSettings(businessId:string){
    return (await getDoc(doc(this.firestore,'business/' + businessId))).data();
  }

  async updateCurrentSettings(settings:any,businessId:string){
    return setDoc(
      doc(this.firestore, 'business/' + businessId),
      settings,
      { merge: true }
    );
  }

  getTables(businessId:string){
    return collectionData(
      collection(
        this.firestore,
        'business/' + businessId + '/tables'
      ),{idField:'id'}
    );
  }

  getTakeawayTokens(businessId:string){
    return collectionData(
      query(collection(
        this.firestore,
        'business/' + businessId + '/tokens'
      ),where('completed','!=',true)),{idField:'id'}
    );
  }

  getOnlineTokens(businessId:string){
    return collectionData(
      collection(
        this.firestore,
        'business/' + businessId + '/onlineTokens'
      ),{idField:'id'}
    );
  }

  getBill(businessId:string,billId:string){
    return docData(doc(this.firestore,'business/' + businessId + '/bills/' + billId));
  }

  getBillPromise(businessId:string,billId:string){
    return getDoc(doc(this.firestore,'business/' + businessId + '/bills/' + billId));
  }

  async getCustomers(businessId:string){
    let customers = getDocs(collection(this.firestore,'business/' + businessId + '/customers'));
    return (await customers).docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as CustomerInfo;
    })
  }

  async updateUser(user:any,businessId:string){
    // get current business
    let business = await getDoc(doc(this.firestore,'business/' + businessId));
    let businessData = business.data();
    console.log("businessData",businessData);
    if (businessData){
      // get current user index
      let userIndex = businessData['users'].findIndex((u:any)=>{return u.username == user.username});
      // update user
      businessData['users'][userIndex] = {...businessData['users'][userIndex],...user};
      // update business
      await updateDoc(doc(this.firestore,'business/' + businessId),{...businessData});
    }
  }

  async addUser(user:any,businessId:string){
    // get current business
    let business = await getDoc(doc(this.firestore,'business/' + businessId));
    let businessData = business.data();
    console.log("businessData",businessData);
    if (businessData){
      // add user
      businessData['users'].push(user);
      // update business
      await updateDoc(doc(this.firestore,'business/' + businessId),{...businessData});
      // get current user
      let currentUser = await getDoc(doc(this.firestore,'users/' + user.username));
      if (currentUser.exists()){
        // add business
        currentUser.data()['business'].push({
          businessId: businessId,
          access: user.access,
          address: businessData['address'],
          city: businessData['city'],
          joiningDate:new Date(),
          name: businessData['hotelName'],
          state: businessData['state']['state'],
        });
        // update user
        await updateDoc(doc(this.firestore,'users/' + user.username),{
          businesses: currentUser.data()['business']
        })
      } else {
        alert("Failed to create new user. Please try again.");
      }
    }
  }

  async deleteUser(username:string,businessId:string){
    let user = await getDoc(doc(this.firestore,'users/' + username));
    if (user.exists()){
      user.data()['business'].splice(user.data()['business'].findIndex((b:{businessId:string})=>{return b.businessId == businessId}),1);
      await updateDoc(doc(this.firestore,'users/' + username),{
        businesses: user.data()['business']
      })
    }
    // get current business
    let business = await getDoc(doc(this.firestore,'business/' + businessId));
    let businessData = business.data();
    console.log("businessData",businessData);
    if (businessData){
      // delete user
      businessData['users'].splice(businessData['users'].findIndex((u:any)=>{return u.username == username}),1);
      // update business
      await updateDoc(doc(this.firestore,'business/' + businessId),{...businessData});
    }
  }

  getCurrentBusiness(businessId:string){
    return docData(doc(this.firestore,'business/' + businessId));
  }

  getSplittedBill(billId:string,splitBillId:string,business:string){
    console.log("Getting splitted bill",billId,splitBillId,business);
    
    // /business/uqd9dm0its2v9xx6fey2q/bills/iqxulix4zfco25bczkmj1z759vl/splittedBills
    return getDoc(doc(this.firestore,`business/${business}/bills/${billId}/splittedBills/${splitBillId}`));
  }

  getCounters(businessId:string){
    return getDocs(collection(this.firestore,'business/' + businessId + '/counters'));
  }

  async updateCounters(businessId:string,counters:any[]){
    await runTransaction(this.firestore,async (transaction)=>{
      for (const counter of counters) {
        transaction.update(doc(this.firestore,'business/' + businessId + '/counters/' + counter.id),{...counter});
      }
    })
  }

  deleteCounter(businessId:string,counterId:string){
    return deleteDoc(doc(this.firestore,'business/' + businessId + '/counters/' + counterId));
  }

  updateCounter(businessId:string,counter:any){
    return updateDoc(doc(this.firestore,'business/' + businessId + '/counters/' + counter.id),{...counter});
  }

  addCounter(businessId:string,counter:any){
    return addDoc(collection(this.firestore,'business/' + businessId + '/counters'),{...counter});
  }

  async updateHoldTokenView(businessId:string,viewTokens:boolean){
    await updateDoc(doc(this.firestore,'business/' + businessId + '/settings/settings'),{viewOnHoldTokens:viewTokens});
  }
}
