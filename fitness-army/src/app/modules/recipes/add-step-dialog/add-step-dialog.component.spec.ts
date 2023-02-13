import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStepDialogComponent } from './add-step-dialog.component';

describe('AddStepDialogComponent', () => {
  let component: AddStepDialogComponent;
  let fixture: ComponentFixture<AddStepDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStepDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
