import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiRangeComponent } from './bmi-range.component';

describe('BmiRangeComponent', () => {
  let component: BmiRangeComponent;
  let fixture: ComponentFixture<BmiRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BmiRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BmiRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
