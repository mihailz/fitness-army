import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {BlogParagraph} from "../../../model/blog-paragraph";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BlogService} from "../../../service/data/blog.service";

@Component({
  selector: 'fitness-army-app-add-paragraph-modal',
  templateUrl: './add-paragraph-modal.component.html',
  styleUrls: ['./add-paragraph-modal.component.scss']
})
export class AddParagraphModalComponent implements OnInit {

  paragraphForm!: FormGroup;

  constructor(private nzModalRef: NzModalRef,
              private fb: FormBuilder,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    this.initParagraphForm();
  }

  closeModal(): void {
    this.nzModalRef.close();
  }

  addParagraph(): void {
    const title = this.paragraphForm.controls['title'].value;
    const content = this.paragraphForm.controls['content'].value;

    this.blogService.setBlogParagraph(new BlogParagraph(
      title, content
    ));
  }

  private initParagraphForm(): void {
    this.paragraphForm = this.fb.group({
      title: this.fb.control('', []),
      content: this.fb.control('', [])
    });
    this.closeModal();
  }
}
