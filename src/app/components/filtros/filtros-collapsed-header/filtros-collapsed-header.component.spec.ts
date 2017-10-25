import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosCollapsedHeaderComponent } from './filtros-collapsed-header.component';

describe('FiltrosCollapsedHeaderComponent', () => {
  let component: FiltrosCollapsedHeaderComponent;
  let fixture: ComponentFixture<FiltrosCollapsedHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosCollapsedHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosCollapsedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
