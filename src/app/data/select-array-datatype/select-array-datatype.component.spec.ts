import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectArrayDatatypeComponent } from './select-array-datatype.component';

describe('SelectArrayDatatypeComponent', () => {
  let component: SelectArrayDatatypeComponent;
  let fixture: ComponentFixture<SelectArrayDatatypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectArrayDatatypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectArrayDatatypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
