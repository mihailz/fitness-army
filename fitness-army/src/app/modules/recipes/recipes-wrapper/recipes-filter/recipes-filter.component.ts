import {Component, EventEmitter, Output} from '@angular/core';
import {MatSelectChange} from "@angular/material/select";
import {RecipesFilterType} from "../../../../model/types/recipes-filter-type";
import {RecipeType} from "../../../../model/recipe-type";

@Component({
  selector: 'fitness-army-app-recipes-filter',
  templateUrl: './recipes-filter.component.html',
  styleUrls: ['./recipes-filter.component.scss']
})
export class RecipesFilterComponent {

  @Output() onRecipesFilterSubmit: EventEmitter<RecipesFilterType> = new EventEmitter<RecipesFilterType>();
  recipeTypes = Object.values(RecipeType);
  selectedType: string = 'ALL';
  searchKey: string = '';

  searchRecipes($event: Event): void {
    const inputElement = <HTMLInputElement>$event.target;
    this.searchKey = inputElement.value;
  }

  onTypeSelectionChange(categoryChangeObject: MatSelectChange): void {
    this.selectedType = categoryChangeObject.value;
  }

  onFilterClick(): void {
    this.onRecipesFilterSubmit.emit({type: this.selectedType, searchKey: this.searchKey})
  }
}
