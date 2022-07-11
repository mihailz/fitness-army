import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsWrapperComponent } from './blogs-wrapper.component';

describe('BlogsWrapperComponent', () => {
  let component: BlogsWrapperComponent;
  let fixture: ComponentFixture<BlogsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
