import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlogFilterCategories} from "../../../../model/blog-type";
import {MatSelectChange} from "@angular/material/select";
import {BlogsFilter} from "../../../../model/types/blogs-filter-type";

@Component({
  selector: 'fitness-army-app-blogs-filter',
  templateUrl: './blogs-filter.component.html',
  styleUrls: ['./blogs-filter.component.scss']
})
export class BlogsFilterComponent implements OnInit {

  @Output() onBlogsFilterSubmit: EventEmitter<BlogsFilter> = new EventEmitter<BlogsFilter>();
  blogCategories = Object.values(BlogFilterCategories);
  selectedCategory: string = BlogFilterCategories.ALL;
  searchKey: string = '';

  ngOnInit(): void {
    this.selectedCategory = this.blogCategories[0];
  }

  searchBlogs($event: Event): void {
    const inputElement = <HTMLInputElement>$event.target;
    this.searchKey = inputElement.value;
  }

  onCategorySelectionChange(categoryChangeObject: MatSelectChange): void {
    this.selectedCategory = categoryChangeObject.value;
  }

  onFilterClick(): void {
    this.onBlogsFilterSubmit.emit({category: this.selectedCategory, searchKey: this.searchKey})
  }
}
