import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscountDetailPage } from './discount-detail.page';

describe('DiscountDetailPage', () => {
  let component: DiscountDetailPage;
  let fixture: ComponentFixture<DiscountDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DiscountDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
