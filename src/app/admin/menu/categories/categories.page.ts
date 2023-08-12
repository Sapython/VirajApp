import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { Category } from 'src/app/core/types/category.structure';
import { Product } from 'src/app/core/types/product.structure';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  VrajeraCategories: Category[] = [];
  viewCategories: {
    id: string;
    viewCategories: Category[];
  }[] = [];
  mainCategories: Category[] = [];
  products: Product[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dataProvider: DataProvider
  ) {}

  async ngOnInit(): Promise<void> {
    let params = await firstValueFrom(this.activatedRoute.params);
    this.dataProvider.menuLoadedSubject.subscribe(async (selectedMenu) => {
      let business = await firstValueFrom(
        this.dataProvider.currentBusiness
      );
      console.log('Selected menu', selectedMenu);
      if (selectedMenu) {
        this.databaseService
          .getRecommendedCategories(business.businessId, selectedMenu.id)
          .then((categories) => {
            console.log('Vrajera categories', categories);
            this.VrajeraCategories = categories;
          });
        this.databaseService
          .getViewCategories(business.businessId, selectedMenu.id)
          .then((categories) => {
            console.log('View categories', categories);
            this.viewCategories = categories;
          });
        this.databaseService
          .getMainCategories(business.businessId, selectedMenu.id)
          .then((categories) => {
            console.log('Main categories', categories);
            this.mainCategories = categories;
          });
        this.databaseService.getProducts(business.businessId,selectedMenu.id).then((products) => {
          this.products = products;
        });
      }
    });
  }
}
