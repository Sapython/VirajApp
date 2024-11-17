import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoyaltyPage } from './loyalty.page';

describe('LoyaltyPage', () => {
  let component: LoyaltyPage;
  let fixture: ComponentFixture<LoyaltyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoyaltyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
