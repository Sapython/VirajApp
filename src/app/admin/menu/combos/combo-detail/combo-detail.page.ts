import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { Category } from 'src/app/core/types/category.structure';
import { Combo } from 'src/app/core/types/combo.structure';

@Component({
  selector: 'app-combo-detail',
  templateUrl: './combo-detail.page.html',
  styleUrls: ['./combo-detail.page.scss'],
})
export class ComboDetailPage implements OnInit {
  imageFile:File|null = null;
  currentCombo:Combo|undefined;
  timeGroups:any[] = [];
  types:any[] = [];
  get selectedTypes():any[]{
    return this.types.filter((type:any)=>type.selected);
  };
  editMode:boolean = false;
  timeGroupVisible:boolean = false;
  typesFormVisible:boolean = false;
  selectItemsVisible:boolean = false;
  conditions:any[] = [];
  mainCategories:Category[] = [];
  selectedType:any;
  days:string[] = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  comboForm:FormGroup = new FormGroup({
    name:new FormControl('',[Validators.required]),
    offerImage: new FormControl('', Validators.required),
    discounted:new FormControl('',[Validators.required]),
    numberOfProducts:new FormControl('',[Validators.required]),
    maximumNoOfPurchases:new FormControl('',[Validators.required]),
    type:new FormControl('',[Validators.required,Validators.pattern('combo|offer')]),
    offerPrice:new FormControl('',[Validators.required]),
  });
  timeGroupForm:FormGroup = new FormGroup({
    name:new FormControl('',[Validators.required])
  });
  typesForm:FormGroup = new FormGroup({
    name:new FormControl('',Validators.required),
    description:new FormControl(''),
    image:new FormControl('',Validators.required),
  });
  constructor(private activatedRoute:ActivatedRoute,private databaseService:DatabaseService,private dataProvider:DataProvider) {
    this.activatedRoute.params.subscribe((params)=>{
      this.dataProvider.currentBusiness.subscribe((business)=>{
        this.dataProvider.menuLoadedSubject.subscribe((menu)=>{
          console.log("params['comboId']",params['comboId'],menu);
          if (business && menu){
            this.databaseService.getComboTypes(business.businessId,menu.id).then((types)=>{
              console.log("types",types);
              this.types = types;
            });
            this.databaseService.getTimeGroups(business.businessId,menu.id).then((timeGroups)=>{
              console.log("timeGroups",timeGroups);
              this.timeGroups = timeGroups;
            });
            this.databaseService.getMainCategories(business.businessId,menu.id).then((categories)=>{
              console.log("categories",categories);
              this.mainCategories = categories;
            });
            if (params['comboId']!='new'){
              this.editMode = true;
              this.databaseService.getCombos(business.businessId,menu.id).then((combos)=>{
                console.log("Combos",combos);
                this.currentCombo = combos.find((combo:Combo)=>combo.id == params['comboId']);
              });
            } else {
              this.editMode = false;
            }
          }
        })
      });
    });
  }

  editTimeGroup(timeGroup:any){

  }

  addTimeGroup(){
    this.timeGroupVisible = true;
  }
  
  addType(){
    this.typesFormVisible = true;
  }

  editType(type:any){

  }

  ngOnInit() {
  }

  selectedTypeChanged(event:any){

  }

  manageType(){

  }

  cancel(){
    
  }

}
