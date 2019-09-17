import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabasePathComponent } from './database-path.component';

describe('DatabasePathComponent', () => {
  let component: DatabasePathComponent;
  let fixture: ComponentFixture<DatabasePathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabasePathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabasePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
