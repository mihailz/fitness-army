import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {User} from "../../../model/user.model";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {StarRatingColor} from "../star-rating/star-rating.component";
import {Review} from "../../../model/review";
@Component({
  selector: 'fitness-army-app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.scss']
})
export class CreateReviewComponent implements OnInit, OnDestroy {

  @Input() recipeId!: string;
  @Output() reviewCreated = new EventEmitter<Review>();
  @Input() loggedInUser!: User | null;
  reviewForm!: FormGroup;
  starColor:StarRatingColor = StarRatingColor.warn;
  rating!: number;
  isFetchingData = false;
  private subscriptions = new Subscription();

  constructor() { }

  ngOnInit(): void {
    this.rating = 0;
    this.initReviewForm();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  onRatingChanged(rating: number): void {
    this.rating = rating;
  }

  onPostReview(): void {
    this.setLoading();
    const review = new Review(
      null,
      this.loggedInUser!,
      new Date().toDateString(),
      this.rating,
      this.reviewForm.get('content')?.value,
      0
    );
    this.reviewCreated.emit(review);
    this.reviewForm.reset();
    this.rating = 0;
  }


  private initReviewForm(): void {
    this.reviewForm = new FormGroup({
      content: new FormControl('', [Validators.required])
    });
  }

  private setLoading(status = true): void {
    this.isFetchingData = status;
  }

  resetForm(formDirective: FormGroupDirective): void {
    formDirective.resetForm();
  }
}
