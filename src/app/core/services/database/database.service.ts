import { Injectable } from '@angular/core';
import { Firestore, getDocs, collection, DocumentData, getDoc, doc, addDoc, updateDoc, setDoc, collectionData, docData, deleteDoc } from '@angular/fire/firestore';
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

  // // helpers
  // setMenu(menuId:string,businessId:string){
  //   if(this.dataProvider.currentBusiness && this.cachedData[businessId]){
  //     this.dataProvider.selectedMenu = this.cachedData[businessId]['menus'][menuId];
  //     console.log("Current menu",this.dataProvider.selectedMenu);
  //   }
  // }
  // // helpers end

  // async getMenus(businessId: string){
  //   var menus:Menu[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'])){
  //     let tempMenus:any = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //     menus = tempMenus.map((menu:any)=>{
  //       if (
  //         (menu['id'] && typeof(menu['id'])=='string') && 
  //         (menu['name'] && typeof(menu['name']) == 'string') && 
  //         (menu['description'] && typeof(menu['description']) == 'string')
  //         ){
  //         return {
  //           id:menu['id'],
  //           name:menu['name'],
  //           description:menu['description'],
  //         }
  //       } else {
  //         return undefined;
  //       }
  //     }).filter((menu:Menu|undefined)=>{return menu != undefined});
  //   } else {
  //     return this.cachedData[businessId]['menus'];
  //   }
  //   console.log("this.cachedData: menus",this.cachedData,menus);
  //   if(this.cachedData[businessId]){
  //     menus.forEach((menu:Menu)=>{
  //       if(!this.cachedData[businessId]['menus']){
  //         this.cachedData[businessId]['menus'] = {};
  //       }
  //       this.cachedData[businessId]['menus'][menu.id] = menu;
  //     })
  //   } else {
  //     this.cachedData[businessId] = {menus:{},...this.cachedData[businessId]};
  //     menus.forEach((menu:Menu)=>{
  //       this.cachedData[businessId]['menus'][menu.id] = menu;
  //     })
  //   }
  //   this.dataProvider.currentBusiness.next(this.dataProvider.currentBusiness!);
  //   return menus;
  // }

  // async getMainCategories(businessId: string,menuId:string){
  //   this.setMenu(menuId,businessId);
  //   var categories:any[] = [];
  //   var products:any[] = [];
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['mainCategories'])){
  //     categories = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/rootCategories'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['mainCategories'];
  //   }
  //   // check if products are available this.cachedData[businessId]['menus'][menuId]['products']
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['products'])){
  //     products = await this.getProducts(businessId,menuId);
  //   } else {
  //     products = this.cachedData[businessId]['menus'][menuId]['products'];
  //   }
    
  //   categories = categories.map((doc) => {
  //     let localProducts = products.filter((p) => {
  //       if (doc['disabled']) {
  //         var notDisabled = doc
  //           ['disabled'].find((id: string) => id == p.id)
  //           ? false
  //           : true;
  //       } else {
  //         var notDisabled = true;
  //       }
  //       p.visible = notDisabled && p.visible;
  //       return (
  //         doc['products'] && doc['products'].includes(p.id)
  //       );
  //     });
  //     return {
  //       ...doc,
  //       name: doc['name'],
  //       id: doc.id,
  //       products: localProducts,
  //       averagePrice:
  //       localProducts.reduce((acc, curr) => acc + curr.price, 0) /
  //       localProducts.length,
  //     } as Category;
  //   });
  //   categories.sort((a, b) => {
  //     if (a.order && b.order) {
  //       return a.order - b.order;
  //     } else {
  //       return 0;
  //     }
  //   });

  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['mainCategories'] = categories;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           mainCategories: categories
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           mainCategories: categories
  //         }
  //       }
  //     }
  //   } else {
  //     this.cachedData[businessId] = {
  //       menus: {
  //         [menuId]: {
  //           mainCategories: categories
  //         }
  //       }
  //     }
  //   }
  //   console.log("this.cachedData",this.cachedData,categories);
  //   return categories;
  // }

  // async getViewCategories(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var categories:any[] = [];
  //   var products:any[] = [];  
  //   // check if products are available this.cachedData[businessId]['menus'][menuId]['products']
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['products'])){
  //     products = await this.getProducts(businessId,menuId);
  //   }
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['viewCategories'])){
  //     let users = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/users')));
  //     categories = await Promise.all(users.docs.map(async doc => {
  //       let viewCategories = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/users/' + doc.id + '/viewCategories')));
  //       let data = {
  //         id:doc.id,
  //         ...doc.data(),
  //         viewCategories:viewCategories.docs.map(doc => {return {id:doc.id,...doc.data()}})
  //       }
  //       return data;
  //     }));
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['viewCategories'];
  //   }
  //   categories = categories.map((category:any)=>{
  //     category.viewCategories = category.viewCategories.map((category:any)=>{
  //       if (category.products){
  //         category.products = category.products.map((productId:string)=>{
  //           let product = products.find((product:any)=>{return product.id == productId});
  //           if (product){
  //             return product;
  //           } else {
  //             return undefined;
  //           }
  //         }).filter((product:any)=>{return product});
  //         return category;
  //       } else {
  //         return undefined;
  //       }
  //     }).filter((category:any)=>{return category});
  //     return category;
  //   }).filter((category:any)=>{return category});
  //   // remove duplicates with same id and merge products
  //   categories = categories.reduce((unique:any, o:any) => {
  //     if(!unique.some((obj:any)=>{return obj.id === o.id})) {
  //       unique.push(o);
  //     } else {
  //       let index = unique.findIndex((obj:any)=>{return obj.id === o.id});
  //       unique[index].viewCategories = unique[index].viewCategories.concat(o.viewCategories);
  //     }
  //     return unique;
  //   },[]);
  //   // this.cachedData[businessId]['menus'][menuId]['viewCategories'] = categories;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['viewCategories'] = categories;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           viewCategories: categories
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           viewCategories: categories
  //         }
  //       }
  //     }
  //   } else {
  //     this.cachedData[businessId] = {
  //       menus: {
  //         [menuId]: {
  //           viewCategories: categories
  //         }
  //       }
  //     }
  //   }
  //   return categories;
  // }

  // async getRecommendedCategories(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var categories:any[] = []
  //   var products:any[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['recommendedCategories'])){
  //     categories = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/recommededCategories'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['recommendedCategories'];
  //   }
  //   // check if products are available this.cachedData[businessId]['menus'][menuId]['products']
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['products'])){
  //     products = await this.getProducts(businessId,menuId);
  //   }
  //   categories = categories.map((category:any)=>{
  //     if (category.products){
  //       category.products = category.products.map((productId:string)=>{
  //         let product = products.find((product:any)=>{return product.id == productId});
  //         if (product){
  //           return product;
  //         } else {
  //           return undefined;
  //         }
  //       }).filter((product:any)=>{return product != undefined});
  //       return category;
  //     } else {
  //       return undefined;
  //     }
  //   }).filter((category:any)=>{return category != undefined});
  //   // this.cachedData[businessId]['menus'][menuId]['recommendedCategories'] = categories;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['recommendedCategories'] = categories;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           recommendedCategories: categories
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           recommendedCategories: categories
  //         }
  //       }
  //     }
  //   } else {
  //     this.cachedData[businessId] = {
  //       menus: {
  //         [menuId]: {
  //           recommendedCategories: categories
  //         }
  //       }
  //     }
  //   }
  //   console.log("this.cachedData recommended cats",JSON.parse(JSON.stringify(this.cachedData)),categories);
  //   return categories;
  // }

  // async getCategoryById(businessId: string,menuId:string,categoryType:string,categoryId:string){
  //   this.setMenu(menuId);
  //   let recommendedType = categoryType.split('-')[1];
  //   categoryType = categoryType.split('-')[0];
  //   console.log("this.cachedData[businessId]",this.cachedData[businessId],categoryType,categoryType.split('-'));
  //   if (this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId]){
  //     console.log("ALL categories",categoryType.split('-'),this.cachedData[businessId]['menus'][menuId][categoryType],categoryType == 'viewCategories');
  //     if (categoryType.split('-')[0] == 'viewCategories'){
  //       console.log("Searching for view category");
  //       var viewCategory = this.cachedData[businessId]['menus'][menuId][categoryType].find((viewCategory:any)=>{return viewCategory.id == recommendedType});
  //       console.log("Found view category",viewCategory);
  //       if(viewCategory){
  //         var category = viewCategory.viewCategories.find((category:any)=>{return category.id == categoryId});
  //       }
  //     } else {
  //       var category = this.cachedData[businessId]['menus'][menuId][categoryType].find((category:any)=>{return category.id == categoryId});
  //     }
  //     console.log("FOUND category",category);
  //     if (category){
  //       return category;
  //     } else {
  //       return {};
  //     }
  //   } else {
  //     return {};
  //   }
  // }

  // async getTaxes(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var taxes:any[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['taxes'])){
  //     taxes = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/taxes'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['taxes'];
  //   }
  //   // this.cachedData[businessId]['menus'][menuId]['taxes'] = taxes;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['taxes'] = taxes;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           taxes: taxes
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           taxes: taxes
  //         }
  //       }
  //     }
  //   }
  //   return taxes;
  // }

  // async addTax(businessId: string,menuId:string,tax:Tax){
  //   this.setMenu(menuId);
  //   await addDoc(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/taxes'),tax);
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['taxes'].push(tax);
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           taxes: [tax]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           taxes: [tax]
  //         }
  //       }
  //     }
  //   }
  // }

  // async updateTax(businessId: string,menuId:string,tax:Tax){
  //   this.setMenu(menuId);
  //   await updateDoc(doc(this.firestore,'business/' + businessId + '/menus/' + menuId + '/taxes/' + tax.id),{...tax});
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         let index = this.cachedData[businessId]['menus'][menuId]['taxes'].findIndex((t:any)=>{return t.id == tax.id});
  //         this.cachedData[businessId]['menus'][menuId]['taxes'][index] = tax;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           taxes: [tax]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           taxes: [tax]
  //         }
  //       }
  //     }
  //   }
  // }

  // async getComboTypes(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var comboTypes:any[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['comboTypes'])){
  //     comboTypes = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/comboTypes'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['comboTypes'];
  //   }
  //   // this.cachedData[businessId]['menus'][menuId]['comboTypes'] = comboTypes;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['comboTypes'] = comboTypes;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           comboTypes: comboTypes
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           comboTypes: comboTypes
  //         }
  //       }
  //     }
  //   }
  //   return comboTypes;
  // }

  // async addComboType(businessId: string,menuId:string,comboType:any){
  //   this.setMenu(menuId);
  //   await addDoc(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/comboTypes'),comboType);
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['comboTypes'].push(comboType);
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           comboTypes: [comboType]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           comboTypes: [comboType]
  //         }
  //       }
  //     }
  //   }
  // }

  // async updateComboType(businessId: string,menuId:string,comboType:any){
  //   this.setMenu(menuId);
  //   await updateDoc(doc(this.firestore,'business/' + businessId + '/menus/' + menuId + '/comboTypes/' + comboType.id),{...comboType});
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         let index = this.cachedData[businessId]['menus'][menuId]['comboTypes'].findIndex((t:any)=>{return t.id == comboType.id});
  //         this.cachedData[businessId]['menus'][menuId]['comboTypes'][index] = comboType;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           comboTypes: [comboType]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           comboTypes: [comboType]
  //         }
  //       }
  //     }
  //   }
  // }

  // async getTimeGroups(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var timeGroups:any[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['timeGroups'])){
  //     timeGroups = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/timeGroups'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['timeGroups'];
  //   }
  //   // this.cachedData[businessId]['menus'][menuId]['timeGroups'] = timeGroups;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['timeGroups'] = timeGroups;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           timeGroups: timeGroups
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           timeGroups: timeGroups
  //         }
  //       }
  //     }
  //   }
  //   return timeGroups;
  // }

  // async addTimeGroup(businessId: string,menuId:string,timeGroup:any){
  //   this.setMenu(menuId);
  //   await addDoc(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/timeGroups'),timeGroup);
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if(this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['timeGroups'].push(timeGroup);
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           timeGroups: [timeGroup]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           timeGroups: [timeGroup]
  //         }
  //       }
  //     }
  //   }
  // }

  // async updateTimeGroup(businessId: string,menuId:string,timeGroup:any){
  //   this.setMenu(menuId);
  //   await updateDoc(doc(this.firestore,'business/' + businessId + '/menus/' + menuId + '/timeGroups/' + timeGroup.id),{...timeGroup});
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if(this.cachedData[businessId]['menus'][menuId]){
  //         let index = this.cachedData[businessId]['menus'][menuId]['timeGroups'].findIndex((t:any)=>{return t.id == timeGroup.id});
  //         this.cachedData[businessId]['menus'][menuId]['timeGroups'][index] = timeGroup;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           timeGroups: [timeGroup]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           timeGroups: [timeGroup]
  //         }
  //       }
  //     }
  //   }
  // }

  // async getCombos(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var combos:any[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['combos'])){
  //     combos = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/combos'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['combos'];
  //   }
  //   // this.cachedData[businessId]['menus'][menuId]['combos'] = combos;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['combos'] = combos;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           combos: combos
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           combos: combos
  //         }
  //       }
  //     }
  //   }
  //   return combos;
  // }

  // async addCombo(businessId: string,menuId:string,combo:any){
  //   this.setMenu(menuId);
  //   await addDoc(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/combos'),combo);
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['combos'].push(combo);
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           combos: [combo]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           combos: [combo]
  //         }
  //       }
  //     }
  //   }
  // }

  // async updateCombo(businessId: string,menuId:string,combo:any){
  //   this.setMenu(menuId);
  //   await updateDoc(doc(this.firestore,'business/' + businessId + '/menus/' + menuId + '/combos/' + combo.id),{...combo});
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         let index = this.cachedData[businessId]['menus'][menuId]['combos'].findIndex((t:any)=>{return t.id == combo.id});
  //         this.cachedData[businessId]['menus'][menuId]['combos'][index] = combo;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           combos: [combo]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           combos: [combo]
  //         }
  //       }
  //     }
  //   }
  // }

  // async getProducts(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var products:any[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId] && this.cachedData[businessId]['menus'][menuId]['products'])){
  //     products = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/products'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['products'];
  //   }
  //   // this.cachedData[businessId]['menus'][menuId]['products'] = products;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['products'] = products;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           products: products
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           products: products
  //         }
  //       }
  //     }
  //   }
  //   return products;
  // }

  // async addProduct(businessId: string,menuId:string,product:any){
  //   this.setMenu(menuId);
  //   await addDoc(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/products'),product);
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if(this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['products'].push(product);
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           products: [product]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           products: [product]
  //         }
  //       }
  //     }
  //   }
  // }

  // async updateProduct(businessId: string,menuId:string,product:any){
  //   this.setMenu(menuId);
  //   await updateDoc(doc(this.firestore,'business/' + businessId + '/menus/' + menuId + '/products/' + product.id),{...product});
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if(this.cachedData[businessId]['menus'][menuId]){
  //         let index = this.cachedData[businessId]['menus'][menuId]['products'].findIndex((p:any)=>{return p.id == product.id});
  //         this.cachedData[businessId]['menus'][menuId]['products'][index] = product;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           products: [product]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           products: [product]
  //         }
  //       }
  //     }
  //   }
  // }

  // async getDiscounts(businessId: string,menuId:string){
  //   this.setMenu(menuId);
  //   var discounts:any[] = []
  //   if (!(this.cachedData && this.cachedData[businessId] && this.cachedData[businessId]['menus'] && this.cachedData[businessId]['menus'][menuId]['discounts'])){
  //     discounts = (await getDocs(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/discounts'))).docs.map(doc => {return {id:doc.id,...doc.data()}});
  //   } else {
  //     return this.cachedData[businessId]['menus'][menuId]['discounts'];
  //   }
  //   // this.cachedData[businessId]['menus'][menuId]['discounts'] = discounts;
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if (this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['discounts'] = discounts;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           discounts: discounts
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           discounts: discounts
  //         }
  //       }
  //     }
  //   }
  //   return discounts;
  // }

  // async addDiscount(businessId: string,menuId:string,discount:any){
  //   this.setMenu(menuId);
  //   await addDoc(collection(this.firestore,'business/' + businessId + '/menus/' + menuId + '/discounts'),discount);
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if(this.cachedData[businessId]['menus'][menuId]){
  //         this.cachedData[businessId]['menus'][menuId]['discounts'].push(discount);
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           discounts: [discount]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           discounts: [discount]
  //         }
  //       }
  //     }
  //   }
  // }

  // async updateDiscount(businessId: string,menuId:string,discount:any){
  //   this.setMenu(menuId);
  //   await updateDoc(doc(this.firestore,'business/' + businessId + '/menus/' + menuId + '/discounts/' + discount.id),{...discount});
  //   if (this.cachedData[businessId]){
  //     if (this.cachedData[businessId]['menus']){
  //       if(this.cachedData[businessId]['menus'][menuId]){
  //         let index = this.cachedData[businessId]['menus'][menuId]['discounts'].findIndex((d:any)=>{return d.id == discount.id});
  //         this.cachedData[businessId]['menus'][menuId]['discounts'][index] = discount;
  //       } else {
  //         this.cachedData[businessId]['menus'][menuId] = {
  //           discounts: [discount]
  //         }
  //       }
  //     } else {
  //       this.cachedData[businessId]['menus'] = {
  //         [menuId]: {
  //           discounts: [discount]
  //         }
  //       }
  //     }
  //   }
  // }

  async getBusinessSetting(businessId: string){
    var businessSetting:any;
    if (!this.cachedData[businessId]['businessSettings']){
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
    if (this.cachedData[businessId]){
      this.cachedData[businessId]['paymentMethods'].push(paymentMethod);
    } else {
      this.cachedData[businessId] = {
        paymentMethods: [paymentMethod]
      }
    }
  }


  async updatePaymentMethod(businessId:string,paymentMethod:any){
    await updateDoc(doc(this.firestore,'business/' + businessId + '/paymentMethods/' + paymentMethod.id),{...paymentMethod});
    if (this.cachedData[businessId]){
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
    if (this.cachedData[businessId]){
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
      collection(
        this.firestore,
        'business/' + businessId + '/tokens'
      ),{idField:'id'}
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
}
