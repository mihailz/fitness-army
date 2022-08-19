import {Component, Input, OnInit} from '@angular/core';
import {Blog} from "../../../../model/blog";
import {BlogType} from "../../../../model/blog-type";

@Component({
  selector: 'fitness-army-app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  @Input() blog!: Blog;
  blogCategories = BlogType;

  constructor() { }

  ngOnInit(): void {
  }

}
