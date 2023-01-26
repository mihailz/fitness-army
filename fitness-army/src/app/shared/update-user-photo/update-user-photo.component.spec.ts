import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserPhotoComponent } from './update-user-photo.component';

describe('UpdateUserPhotoComponent', () => {
  let component: UpdateUserPhotoComponent;
  let fixture: ComponentFixture<UpdateUserPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
