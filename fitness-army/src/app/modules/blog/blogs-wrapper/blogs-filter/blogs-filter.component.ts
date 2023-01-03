import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlogFilterCategories} from "../../../../model/blog-type";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'fitness-army-app-blogs-filter',
  templateUrl: './blogs-filter.component.html',
  styleUrls: ['./blogs-filter.component.scss']
})
export class BlogsFilterComponent implements OnInit {

  @Input() userRole!: string;
  @Output() onSearchBlogs: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCategorySelect: EventEmitter<string> = new EventEmitter<string>();
  blogCategories = Object.values(BlogFilterCategories);
  selectedCategory: string = 'ALL';

  constructor() {
  }

  ngOnInit(): void {
    this.selectedCategory = this.blogCategories[0];
  }

  searchBlogs($event: Event): void {
    const inputElement = <HTMLInputElement>$event.target;
    const searchValue = inputElement.value;
    this.onSearchBlogs.emit(searchValue);
  }

  onCategorySelectionChange(categoryChangeObject: MatSelectChange): void {
    this.selectedCategory = categoryChangeObject.value;
    this.onCategorySelect.emit(this.selectedCategory);
  }
}
