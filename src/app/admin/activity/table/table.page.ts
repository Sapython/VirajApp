import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { TableConstructor } from 'src/app/core/types/table.structure';

@Component({
  selector: 'app-table',
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {
  tables: TableConstructor[] = [];
  takeawayTokens: TableConstructor[] = [];
  onlineTokens: TableConstructor[] = [];
  settings: any;
  billSubscriptions: any[] = [];
  emptyTables: number = 0;
  lateRunningTables: number = 0;
  finalizedTables: number = 0;
  activeTables: number = 0;
  dineInLayout:'four'|'two' = 'four';
  takeawayLayout:'four'|'two' = 'four';
  onlineLayout:'four'|'two' = 'four';
  tableGroups:{name:string,tables:TableConstructor[]}[] = [];
  constructor(
    private dataProvider: DataProvider,
    private databaseService: DatabaseService
  ) {
    setInterval(() => {
      this.emptyTables = 0;
      this.lateRunningTables = 0;
      this.finalizedTables = 0;
      this.activeTables = 0;
      this.tableGroups.forEach((group) => {
        group.tables.forEach((table) => {
          if (table.status == 'occupied') {
            let timeSpent =
              new Date().getTime() - table.occupiedStart.toDate().getTime();
            table.timeSpent = this.formatTime(timeSpent);
            table.minutes = Math.floor(timeSpent / 1000 / 60);
            if (table.minutes > 30) {
              this.lateRunningTables++;
            }
            this.activeTables++;
          } else if (table.bill?.stage == 'finalized') {
            this.finalizedTables++;
          } else {
            this.emptyTables++;
          }
        });
      })
      // this.tables.forEach((table) => {
      //   if (table.status == 'occupied') {
      //     let timeSpent =
      //       new Date().getTime() - table.occupiedStart.toDate().getTime();
      //     table.timeSpent = this.formatTime(timeSpent);
      //     table.minutes = Math.floor(timeSpent / 1000 / 60);
      //     if (table.minutes > 30) {
      //       this.lateRunningTables++;
      //     }
      //     this.activeTables++;
      //   } else if (table.bill?.stage == 'finalized') {
      //     this.finalizedTables++;
      //   } else {
      //     this.emptyTables++;
      //   }
      // });
      this.takeawayTokens.forEach((table) => {
        if (table.completed){
          return
        }
        if (table.status == 'occupied') {
          let timeSpent =
            new Date().getTime() - table.occupiedStart.toDate().getTime();
          table.timeSpent = this.formatTime(timeSpent);
          table.minutes = Math.floor(timeSpent / 1000 / 60);
          if (table.minutes > 30) {
            this.lateRunningTables++;
          }
          this.activeTables++;
        } else if (table.bill?.stage == 'finalized') {
          this.finalizedTables++;
        } else {
          this.emptyTables++;
        }
      });
      this.onlineTokens.forEach((table) => {
        if (table.completed){
          return
        }
        if (table.status == 'occupied') {
          let timeSpent =
            new Date().getTime() - table.occupiedStart.toDate().getTime();
          table.timeSpent = this.formatTime(timeSpent);
          table.minutes = Math.floor(timeSpent / 1000 / 60);
          if (table.minutes > 30) {
            this.lateRunningTables++;
          }
          this.activeTables++;
        } else if (table.bill?.stage == 'finalized') {
          this.finalizedTables++;
        } else {
          this.emptyTables++;
        }
      });
    }, 1000);
    this.dataProvider.currentBusiness.subscribe(async (data) => {
      this.settings = await this.databaseService.getRootSettings(data.businessId);
      this.databaseService
        .getTables(data.businessId)
        .subscribe((tables: any[]) => {
          this.tables = tables.map((table) => {
            let subIndex = this.billSubscriptions.findIndex(
              (billSubscription) => {
                return billSubscription.id == table.bill;
              }
            );
            if (subIndex == -1) {
              let sub = this.databaseService.getBill(
                data.businessId,
                table.bill
              );
              let subbed = sub.subscribe((bill: any) => {
                console.log('Bill', bill);
                table.bill = bill;
              });
              this.billSubscriptions.push({
                id: table.bill,
                billSubscription: subbed,
              });
              console.log('Bill Subscriptions', this.billSubscriptions);
              subIndex = this.billSubscriptions.length - 1;
            }
            return table;
          });
          this.tableGroups = this.reOrderTable(this.tables,this.settings);
          console.log("this.tableGroups",this.tableGroups);
        });
      this.databaseService
        .getTakeawayTokens(data.businessId)
        .subscribe((tables: any[]) => {
          console.log('Tables', tables);
          this.takeawayTokens = tables.map((table) => {
            let subIndex = this.billSubscriptions.findIndex(
              (billSubscription) => {
                return billSubscription.id == table.bill;
              }
            );
            if (subIndex == -1) {
              let sub = this.databaseService.getBill(
                data.businessId,
                table.bill
              );
              let subbed = sub.subscribe((bill: any) => {
                console.log('Bill', bill);
                table.bill = bill;
              });
              this.billSubscriptions.push({
                id: table.bill,
                billSubscription: subbed,
              });
              console.log('Bill Subscriptions', this.billSubscriptions);
              subIndex = this.billSubscriptions.length - 1;
            }
            return table;
          });
        });
      this.databaseService
        .getOnlineTokens(data.businessId)
        .subscribe((tables: any[]) => {
          console.log('Tables', tables);
          this.onlineTokens = tables.map((table) => {
            let subIndex = this.billSubscriptions.findIndex(
              (billSubscription) => {
                return billSubscription.id == table.bill;
              }
            );
            if (subIndex == -1) {
              let sub = this.databaseService.getBill(
                data.businessId,
                table.bill
              );
              let subbed = sub.subscribe((bill: any) => {
                console.log('Bill', bill);
                table.bill = bill;
              });
              this.billSubscriptions.push({
                id: table.bill,
                billSubscription: subbed,
              });
              console.log('Bill Subscriptions', this.billSubscriptions);
              subIndex = this.billSubscriptions.length - 1;
            }
            return table;
          });
        });
    });
  }

  ngOnInit() {}

  formatTime(time: number) {
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    // only show hours if it is greater than 0
    // only show minutes if it is greater than 0
    // only show seconds if it is greater than 0
    return `${hours > 0 ? hours + 'h ' : ''}${
      minutes > 0 ? minutes + 'm ' : ''
    }${seconds > 0 ? seconds + 's' : ''}`;
  }

  reOrderTable(tables:TableConstructor[],settings:any) {
    let groupedTables:{name:string,tables:TableConstructor[]}[] = [];
    tables.forEach((r) => {
      let tableGroup = groupedTables.find((group) => group.name == r.group);
      if (tableGroup) {
        tableGroup.tables.push(r);
      } else {
        groupedTables.push({
          name: r.group,
          tables: [r],
        });
      }
    });
    groupedTables.forEach((group) => {
      // sort tables by order or by name
      group.tables.sort((a, b) => {
        if (a.order != undefined && b.order != undefined) {
          return a.order - b.order;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
    });
    // there exists a table settings groupOrders with the order of groups like ["od","indoor"]
    if (settings?.groupOrders) {
      // reorder the groupedTables using the array using that group orders
      console.log("Grouped orders",settings?.groupOrders);
      groupedTables.sort((a, b) => {
        return (
          settings?.groupOrders.indexOf(a.name) -
          settings?.groupOrders.indexOf(b.name)
        );
      });
    }
    return groupedTables;
  }
}
