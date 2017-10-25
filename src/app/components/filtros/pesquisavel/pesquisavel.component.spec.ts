import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisavelComponent } from './pesquisavel.component';

describe('PesquisavelComponent', () => {
  let component: PesquisavelComponent;
  let fixture: ComponentFixture<PesquisavelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesquisavelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
