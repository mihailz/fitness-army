import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'fitness-army-app-add-step-dialog',
  templateUrl: './add-step-dialog.component.html',
  styleUrls: ['./add-step-dialog.component.scss']
})
export class AddStepDialogComponent implements OnInit {

  stepForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddStepDialogComponent>) {
  }

  ngOnInit(): void {
    this.initIngredientForm();
  }

  onConfirmClick(): void {
    if (this.stepForm.valid) {
      this.dialogRef.close(this.stepForm);
    } else {
      this.stepForm.updateValueAndValidity();
    }
  }

  private initIngredientForm(): void {
    this.stepForm = new FormGroup({
      step: new FormControl('', [Validators.required])
    });
  }
}
