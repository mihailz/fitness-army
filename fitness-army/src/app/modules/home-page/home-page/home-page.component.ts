import { Component } from '@angular/core';
import {ICard} from "../../../model/card";
import {HOME_PAGE_CARDS} from "../../../mappings/home-page-cards";

@Component({
  selector: 'fitness-army-app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  cards: ICard[] = HOME_PAGE_CARDS;
}
