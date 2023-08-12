import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { BillConstructor } from 'src/app/core/types/bill.structure';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  // bills: ActivityBillConstructor[] = [];

  loading: boolean = false;
  cachedData: CachedData[] = [];

  downloadPdf: Subject<void> = new Subject<void>();
  downloadExcel: Subject<void> = new Subject<void>();

  dateRangeFormGroup: FormGroup = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });
  dataChanged: ReplaySubject<void> = new ReplaySubject<void>(1);
  constructor(
    private firestore: Firestore,
    private dataProvider: DataProvider,
  ) {
    this.dateRangeFormGroup.valueChanges.subscribe(async (value) => {
      if (this.dateRangeFormGroup.valid) {
        this.dataChanged.next();
      }
    });
    this.dateRangeFormGroup.setValue({
      startDate: new Date(),
      endDate: new Date(),
    });
  }

  async getBills(startDate: Date, endDate: Date,businessId:string) {
    this.loading = true;
    // don't fetch if already cached or even if it is cached, fetch if it is more than 20 minutes old
    if (this.cachedData.length > 0) {
      let cachedData = this.cachedData.find((data) => {
        return (
          // only match day, month and year
          data.startDate.getDate() == startDate.getDate() &&
          data.startDate.getMonth() == startDate.getMonth() &&
          data.startDate.getFullYear() == startDate.getFullYear() &&
          data.endDate.getDate() == endDate.getDate() &&
          data.endDate.getMonth() == endDate.getMonth() &&
          data.endDate.getFullYear() == endDate.getFullYear()
        );
      });
      if (cachedData) {
        let now = new Date();
        let diff = now.getTime() - cachedData.endDate.getTime();
        if (diff < 20 * 60 * 1000) {
          this.loading = false;
          return cachedData.bills;
        }
      }
    }
    let bills = await this.getBillsByDay(startDate,businessId, endDate);
    let newBills = await Promise.all(
      bills.docs.map(async (bill) => {
        let billData = bill.data() as ActivityBillConstructor;
        let activities = await this.getActivity(bill.id,businessId);
        billData.activities = activities.docs.map((activity) => {
          return activity.data();
        });
        return billData;
      }),
    );
    this.cachedData.push({
      startDate: startDate,
      endDate: endDate,
      bills: newBills,
    });
    console.log('CACHED BILLS', this.cachedData);
    this.loading = false;
    return newBills;
  }

  async getTableActivity(businessId:string) {
    let date: Date = this.dateRangeFormGroup.value.startDate;
    let endDate: Date = this.dateRangeFormGroup.value.endDate;
    let minTime = new Date(date);
    minTime.setHours(0, 0, 0, 0);
    if (endDate) {
      var maxTime = new Date(endDate);
      maxTime.setHours(23, 59, 59, 999);
    } else {
      var maxTime = new Date(date);
      maxTime.setHours(23, 59, 59, 999);
    }
    let docs = await getDocs(
      query(
        collection(
          this.firestore,
          `business/${businessId}/tableActivity`,
        ),
        where('time', '>=', minTime),
        where('time', '<=', maxTime),
      ),
    );
    return docs.docs.map((doc) => {
      return doc.data();
    });
  }

  getBillsByDay(date: Date,businessId:string, endDate?: Date) {
    let minTime = new Date(date);
    minTime.setHours(0, 0, 0, 0);
    if (endDate) {
      var maxTime = new Date(endDate);
      maxTime.setHours(23, 59, 59, 999);
    } else {
      var maxTime = new Date(date);
      maxTime.setHours(23, 59, 59, 999);
    }
    return getDocs(
      query(
        collection(
          this.firestore,
          'business/' + businessId + '/bills',
        ),
        where('createdDate', '>=', minTime),
        where('createdDate', '<=', maxTime),
      ),
    );
  }

  getActivity(billId: string,businessId:string) {
    return getDocs(
      collection(
        this.firestore,
        'business/' +
        businessId +
          '/bills/' +
          billId +
          '/billActivities',
      ),
    );
  }
}

interface ActivityBillConstructor extends BillConstructor {
  activities: any[];
}

interface CachedData {
  startDate: Date;
  endDate: Date;
  bills: ActivityBillConstructor[];
}
