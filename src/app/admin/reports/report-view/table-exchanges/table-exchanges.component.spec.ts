import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExchangesComponent } from './table-exchanges.component';

describe('TableExchangesComponent', () => {
  let component: TableExchangesComponent;
  let fixture: ComponentFixture<TableExchangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableExchangesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableExchangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
