import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeReviewsComponent } from './recipe-reviews.component';

describe('RecipeReviewsComponent', () => {
  let component: RecipeReviewsComponent;
  let fixture: ComponentFixture<RecipeReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeReviewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
