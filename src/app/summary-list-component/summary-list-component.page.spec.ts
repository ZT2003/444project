import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryListComponentPage } from './summary-list-component.page';

describe('SummaryListComponentPage', () => {
  let component: SummaryListComponentPage;
  let fixture: ComponentFixture<SummaryListComponentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryListComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
