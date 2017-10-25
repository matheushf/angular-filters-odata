import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchDropdownComponent } from './switch-dropdown.component';

describe('SwitchDropdownComponent', () => {
  let component: SwitchDropdownComponent;
  let fixture: ComponentFixture<SwitchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
