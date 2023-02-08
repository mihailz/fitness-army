import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserBodyStatsComponent } from './update-user-body-stats.component';

describe('UpdateUserBodyStatsComponent', () => {
  let component: UpdateUserBodyStatsComponent;
  let fixture: ComponentFixture<UpdateUserBodyStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserBodyStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserBodyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
