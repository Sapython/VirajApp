import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillerPage } from './biller.page';

describe('BillerPage', () => {
  let component: BillerPage;
  let fixture: ComponentFixture<BillerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BillerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
