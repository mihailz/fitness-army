import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'fitness-army-app-add-ingredient-dialog',
  templateUrl: './add-ingredient-dialog.component.html',
  styleUrls: ['./add-ingredient-dialog.component.scss']
})
export class AddIngredientDialogComponent implements OnInit {

  ingredientForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddIngredientDialogComponent>) {
  }

  ngOnInit(): void {
    this.initIngredientForm();
  }

  onConfirmClick(): void {
    if (this.ingredientForm.valid) {
      this.dialogRef.close(this.ingredientForm);
    } else {
      this.ingredientForm.updateValueAndValidity();
    }
  }

  private initIngredientForm(): void {
    this.ingredientForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      amount: new FormControl('')
    });
  }

}
