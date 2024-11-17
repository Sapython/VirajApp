import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { Category } from 'src/app/core/types/category.structure';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
})
export class CategoryDetailPage {
  currentCategory:Category|undefined;
  categoryType:string = "";
  
  constructor(private activatedRoute:ActivatedRoute,private databaseService:DatabaseService,private dataProvider:DataProvider){
    this.dataProvider.currentBusiness.subscribe((business)=>{
      console.log("business",business);
      activatedRoute.params.subscribe((params)=>{
        if(!this.dataProvider.selectedMenu){return}
        console.log("params:",params);
        this.categoryType = params['categoryType'];
        console.log(business.businessId,this.dataProvider.selectedMenu.id,params['categoryType'],params['categoryId']);
        this.databaseService.getProducts(business.businessId,this.dataProvider.selectedMenu.id).then((products)=>{
          this.currentCategory = {
            name:'All Products',
            id:'all',
            enabled:true,
            products:products,
          }
        })
        this.databaseService.getCategoryById(business.businessId,this.dataProvider.selectedMenu.id,params['categoryType'],params['categoryId']).then((category)=>{
          console.log("products",category);
          this.currentCategory = category;
        })
      });
    })
  }
}
