import { Component } from '@angular/core';
import { DatabaseService } from './core/services/database/database.service';
import { DataProvider } from './core/services/data-provider/data-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private database:DatabaseService,private dataProvider:DataProvider) {}
}
