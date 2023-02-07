import {Component, Input, OnInit} from '@angular/core';
import {UserBodyStats} from "../../../../model/user-body-stats.model";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Color} from "ng2-charts";

@Component({
  selector: 'fitness-army-app-bmi-range',
  templateUrl: './bmi-range.component.html',
  styleUrls: ['./bmi-range.component.scss']
})
export class BmiRangeComponent implements OnInit {

  @Input() userBodyStats!: UserBodyStats | null;
  @Input() chartData: any;

  public bubbleChartOptions: ChartOptions = {}
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = true;
  public bubbleChartData: ChartDataSets[] = [];
  public bubbleChartColors: Color[] = [
    {
      backgroundColor: [
        'red',
        'green',
        'blue',
        'purple',
      ]
    }
  ];


  constructor() {
  }

  ngOnInit(): void {
    this.initChartData();
  }

  private initChartData(): void {
    this.bubbleChartOptions = {
      tooltips: {
        backgroundColor: '#1F2833',
        yPadding: 12,
        xPadding: 12,
        caretPadding: 12,
        callbacks: {
          label(tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData): string | string[] {
            let tooltips: string[] = [];
            const currentIndex = tooltipItem.datasetIndex;
            const dataSetItem = data.datasets?.find((value: ChartDataSets, index) => index === currentIndex);
            if (dataSetItem && dataSetItem.data) {
              const dataSetData = dataSetItem.data[0];
              if (dataSetData) {
                Object.entries(dataSetData)
                  .forEach(entry => {
                      if (entry[0] === 'x') {
                        const weightLabel = `Weight: ${entry[1]}kg`;
                        tooltips.push(weightLabel);
                      }
                      if (entry[0] === 'y') {
                        const heightLabel = `Height: ${entry[1]}cm`;
                        tooltips.push(heightLabel);
                      }
                      if (entry[0] === 'r') {
                        const bmiLabel = `Bmi: ${entry[1]}%`;
                        tooltips.push(bmiLabel);
                      }
                    }
                  )
              }
            }
            return tooltips;
          }
        }
      },
      legend: {
        labels: {
          fontColor: 'gray',
          fontSize: 14,
          fontStyle: 'bold'
        }
      },
      responsive: true,
      title: {
        text: "Are you in a healthy bmi range?",
        display: true,
        fontStyle: 'bold',
        fontSize: 20,
        fontColor: 'gray'
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
              color: 'gray',
              drawBorder: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Weight (kg)',
              fontColor: 'gray'
            },
            ticks: {
              min: 0,
              max: 250,
            }
          }],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: 'gray',
              drawBorder: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Height (cm)',
              fontColor: 'gray'
            },
            ticks: {
              min: 0,
              max: 250,
            }
          }]
      }
    };

    this.bubbleChartData = [{
      data: [
        {
          x: this.userBodyStats?.bodyStats.weight,
          y: this.userBodyStats?.bodyStats.height,
          r: this.userBodyStats?.bodyMassIndex?.bmi
        },
      ],
      label: 'Your bmi range',
    },
      {
        data: [
          {
            x: this.userBodyStats?.idealBodyWeight?.idealWeight,
            y: this.userBodyStats?.bodyStats.height,
            r: this.calculateHealthyBmi(this.userBodyStats?.bodyMassIndex?.healthyBmiRange)
          },
        ],
        label: 'Recommended bmi range',
      },
    ];
  }

  private calculateHealthyBmi(range: string | undefined): number {
    if (range) {
      const healthyBmiRange = range.split('-');
      const lowerBound = healthyBmiRange[0];
      const upperBound = healthyBmiRange[1];
      const recommendedBmi = (+lowerBound + +upperBound) / 2;
      return recommendedBmi;
    }
    return 0;
  }

}
