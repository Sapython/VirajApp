import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoldedBillsPage } from './holded-bills.page';

describe('HoldedBillsPage', () => {
  let component: HoldedBillsPage;
  let fixture: ComponentFixture<HoldedBillsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HoldedBillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
