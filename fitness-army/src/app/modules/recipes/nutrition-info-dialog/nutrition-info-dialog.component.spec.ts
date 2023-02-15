import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionInfoDialogComponent } from './nutrition-info-dialog.component';

describe('NutritionInfoDialogComponent', () => {
  let component: NutritionInfoDialogComponent;
  let fixture: ComponentFixture<NutritionInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutritionInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
