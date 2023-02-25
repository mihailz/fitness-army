import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'fitness-army-app-add-paragraph',
  templateUrl: './add-paragraph.component.html',
  styleUrls: ['./add-paragraph.component.scss']
})
export class AddParagraphComponent implements OnInit {
  paragraphForm!: FormGroup;
  paragraphContent!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddParagraphComponent>) {
  }

  ngOnInit(): void {
    this.initAddParagraphForm();
    this.initParagraphContentForm();
  }

  get content(): FormArray {
    return this.paragraphForm.get('content') as FormArray;
  }

  onConfirmClick(): void {
    if (this.paragraphForm.valid) {
      this.dialogRef.close(this.paragraphForm);
    } else {
      this.paragraphForm.updateValueAndValidity();
    }
  }

  private initAddParagraphForm(): void {
    this.paragraphForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormArray([]),
      isUpdating: new FormControl(false)
    });
  }

  private initParagraphContentForm(): void {
    this.paragraphContent = new FormGroup({
      text: new FormControl('')
    })
  }

  onAddParagraph(): void {
    if (this.paragraphContent.get('text')?.value !== '') {
      this.content.push(new FormGroup({
        text: new FormControl(this.paragraphContent.get('text')?.value)
      }));
      this.paragraphContent.get('text')?.reset();
    }
  }
}
