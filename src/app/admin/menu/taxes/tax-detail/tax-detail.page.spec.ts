import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxDetailPage } from './tax-detail.page';

describe('TaxDetailPage', () => {
  let component: TaxDetailPage;
  let fixture: ComponentFixture<TaxDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TaxDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
