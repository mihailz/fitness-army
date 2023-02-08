import {Component, Input, OnInit} from '@angular/core';
import {ChartOptions} from "chart.js";
import {UserBodyStats} from "../../../../model/user-body-stats.model";

@Component({
  selector: 'fitness-army-app-bmi-chart',
  templateUrl: './bmi-chart.component.html',
  styleUrls: ['./bmi-chart.component.scss']
})
export class BmiChartComponent implements OnInit {

  @Input() chartLabels: string[] = [];
  @Input() userBodyStats!: UserBodyStats | null;
  chartData: any;
  chartOptions: ChartOptions = {
    responsive: true,
    title: {
      text: "Body mass (kg)",
      display: true,
      fontStyle: 'bold',
      fontSize: 20
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.initChartData();
  }

  private initChartData(): void {
    this.chartLabels = ['Lean mass', 'Fat mass'];
    this.chartData = [this.userBodyStats?.bodyFatPercentage?.leanMassWeight,
      this.userBodyStats?.bodyFatPercentage?.fatMassWeight];
    console.log('Chart data: ', this.chartData);
  }

}
