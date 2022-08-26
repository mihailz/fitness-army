import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsFilterComponent } from './blogs-filter.component';

describe('BlogsFilterComponent', () => {
  let component: BlogsFilterComponent;
  let fixture: ComponentFixture<BlogsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
