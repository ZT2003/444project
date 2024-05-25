import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraftsPage } from './drafts.page';

describe('DraftsPage', () => {
  let component: DraftsPage;
  let fixture: ComponentFixture<DraftsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
