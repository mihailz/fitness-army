import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'fitness-army-app-add-paragraph',
  templateUrl: './add-paragraph.component.html',
  styleUrls: ['./add-paragraph.component.scss']
})
export class AddParagraphComponent implements OnInit {
  paragraphForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddParagraphComponent>) {
  }

  ngOnInit(): void {
    this.initAddParagraphForm();
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.paragraphForm);
  }

  private initAddParagraphForm(): void {
    this.paragraphForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl(''),
      isUpdating: new FormControl(false)
    });
  }

}
