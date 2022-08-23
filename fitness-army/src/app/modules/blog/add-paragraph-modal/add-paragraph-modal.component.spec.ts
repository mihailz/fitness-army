import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParagraphModalComponent } from './add-paragraph-modal.component';

describe('AddParagraphModalComponent', () => {
  let component: AddParagraphModalComponent;
  let fixture: ComponentFixture<AddParagraphModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddParagraphModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParagraphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
