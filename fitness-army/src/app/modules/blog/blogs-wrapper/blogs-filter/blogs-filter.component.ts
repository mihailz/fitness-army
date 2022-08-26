import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlogType} from "../../../../model/blog-type";

@Component({
  selector: 'fitness-army-app-blogs-filter',
  templateUrl: './blogs-filter.component.html',
  styleUrls: ['./blogs-filter.component.scss']
})
export class BlogsFilterComponent implements OnInit {

  @Input() userRole!: string;
  @Output() onSearchBlogs: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCategorySelect: EventEmitter<string> = new EventEmitter<string>();
  blogCategories = Object.values(BlogType);

  constructor() { }

  ngOnInit(): void {
  }

  searchBlogs($event: Event): void {
    const inputElement = <HTMLInputElement>$event.target;
    const searchValue = inputElement.value;
    this.onSearchBlogs.emit(searchValue);
  }


  categorySelect(selectedCategory: string): void {
    this.onCategorySelect.emit(selectedCategory);
  }
}
