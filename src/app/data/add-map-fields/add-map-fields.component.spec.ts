import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapFieldsComponent } from './add-map-fields.component';

describe('AddMapFieldsComponent', () => {
  let component: AddMapFieldsComponent;
  let fixture: ComponentFixture<AddMapFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
