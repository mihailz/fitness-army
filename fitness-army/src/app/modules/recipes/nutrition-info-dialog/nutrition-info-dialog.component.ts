import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'fitness-army-app-nutrition-info-dialog',
  templateUrl: './nutrition-info-dialog.component.html',
  styleUrls: ['./nutrition-info-dialog.component.scss']
})
export class NutritionInfoDialogComponent implements OnInit {

  nutritionInfoForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<NutritionInfoDialogComponent>) {
  }

  ngOnInit(): void {
    this.initNutritionForm();
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.nutritionInfoForm);
  }

  private initNutritionForm(): void {
    this.nutritionInfoForm = new FormGroup({
      calories: new FormControl('', [Validators.required]),
      totalFat: new FormControl('', [Validators.required]),
      saturatedFat: new FormControl('', [Validators.required]),
      cholesterol: new FormControl('', [Validators.required]),
      sodium: new FormControl('', [Validators.required]),
      carbohydrates: new FormControl('', [Validators.required]),
      dietaryFiber: new FormControl('', [Validators.required]),
      sugar: new FormControl('', [Validators.required]),
      protein: new FormControl('', [Validators.required]),
    });
  }
}
