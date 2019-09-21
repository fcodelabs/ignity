import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentIDComponent } from './document-id.component';

describe('DocumentIDComponent', () => {
  let component: DocumentIDComponent;
  let fixture: ComponentFixture<DocumentIDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentIDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
