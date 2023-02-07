import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserBodyStatsComponent } from './create-user-body-stats.component';

describe('CreateUserBodyStatsComponent', () => {
  let component: CreateUserBodyStatsComponent;
  let fixture: ComponentFixture<CreateUserBodyStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserBodyStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserBodyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
