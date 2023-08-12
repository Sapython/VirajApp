import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { Category } from 'src/app/core/types/category.structure';
import { Product } from 'src/app/core/types/product.structure';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  mainCategories:Category[] = [];
  currentProduct:Product|undefined;
  currentCategory:Category|undefined;
  categoryType:string = '';
  categoryId: string = '';
  editMode:boolean = false;
  selectedMainCategory:Category|undefined;
  tags:{color:string,name:string,contrast:string}[] = [
    {
      color:'tomato',
      contrast:'white',
      name:'Half',
    },
    {
      color:'green',
      contrast:'white',
      name:'Full',
    }
  ];
  productForm:FormGroup = new FormGroup({
    name:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
    price:new FormControl('',[Validators.required,Validators.min(0)]),
    type:new FormControl('',[Validators.required,Validators.pattern(/^(veg|non-veg)$/)]),
    tags:new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
    mainCategory:new FormControl(''),
  });
  constructor(private activatedRoute:ActivatedRoute,private databaseService:DatabaseService,private dataProvider:DataProvider){
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.dataProvider.menuLoadedSubject.subscribe((menu)=>{
        console.log("business",business);
        activatedRoute.params.subscribe((params)=>{
          console.log("params:",params);
          if (!this.dataProvider.selectedMenu){
            return;
          }
          this.categoryType = params['categoryType'];
          this.categoryId = params['categoryId'];
          this.databaseService.getCategoryById(business.businessId,this.dataProvider.selectedMenu.id,params['categoryType'],params['categoryId']).then((category:Category)=>{
            console.log("products",category);
            this.currentCategory = category;
            if (params['productId']=='new'){
              this.editMode = false;
            } else {
              this.editMode = true;
              this.currentProduct = category.products.find((product:Product)=>{
                return product.id == params['productId'];
              });
            }
          });
          this.databaseService.getMainCategories(business.businessId,menu.id).then((categories:Category[])=>{
            console.log("categories",categories);
            this.mainCategories = categories;
          });
        });
      })
    });
  }

  save(){
    if (this.editMode){
      // update the product by using the product id
    } else {
      // add new product
    }
  }

  ngOnInit() {
  }

}
