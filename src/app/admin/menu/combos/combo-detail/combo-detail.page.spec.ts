import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboDetailPage } from './combo-detail.page';

describe('ComboDetailPage', () => {
  let component: ComboDetailPage;
  let fixture: ComponentFixture<ComboDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ComboDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
