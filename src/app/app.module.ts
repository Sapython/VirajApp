import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, iosTransitionAnimation } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataProvider } from './core/services/data-provider/data-provider.service';
import { DownloadService } from './core/services/download.service';
import { AlertsAndNotificationsService } from './core/services/alerts-and-notification/alerts-and-notifications.service';
import { DatabaseService } from './core/services/database/database.service';
import { AuthService } from './core/services/auth/auth.service';
import { ActivityDetailComponent } from './core/services/activityDetail/activity-detail/activity-detail.component';
import { QuickBillComponent } from './core/services/activityDetail/quick-bill/quick-bill.component';
@NgModule({
  declarations: [AppComponent,ActivityDetailComponent,QuickBillComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({animated:true,navAnimation:iosTransitionAnimation}),
    AppRoutingModule,
    MatNativeDateModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => {
      let functions = getFunctions();
      // connectFunctionsEmulator(functions, 'localhost', 5001);
      return functions;
    }),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenTrackingService,
    UserTrackingService,
    DownloadService,DataProvider,AlertsAndNotificationsService,DatabaseService,AuthService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
