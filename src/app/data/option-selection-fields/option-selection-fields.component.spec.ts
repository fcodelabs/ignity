import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSelectionFieldsComponent } from './option-selection-fields.component';

describe('OptionSelectionFieldsComponent', () => {
  let component: OptionSelectionFieldsComponent;
  let fixture: ComponentFixture<OptionSelectionFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionSelectionFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionSelectionFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
