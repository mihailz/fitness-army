import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'fitness-army-app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input() rating: number = 0;
  @Input() starCount!: number;
  @Input() color: StarRatingColor = StarRatingColor.accent;
  @Output() ratingUpdated = new EventEmitter();
  ratingArray: number[] = [];

  constructor() { }

  ngOnInit(): void {
    for(let i = 0; i < this.starCount; i++) {
      this.ratingArray.push(i);
    }
  }

  onClick(rating:number): boolean {
      console.log(rating)
      this.ratingUpdated.emit(rating);
      return false;
  }

  showIcon(index:number): string {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
