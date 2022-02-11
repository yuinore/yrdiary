import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import ChartArgs from '../models/ChartArgs';

const CHART_FILL_COLORS = [
  '#f85555',
  '#f89922',
  '#f8d000',
  '#44cc55',
  '#99d0ee',
  '#44aaee',
  '#7777f8',
  '#dd66dd',
  '#f8aacc',
  '#aaaaaa',
  '#666666',
];

class ApexStackedBarChart extends React.Component<{ chartArgs: ChartArgs }, any> {
  private chartId: string;

  constructor(props) {
    super(props);

    this.chartId = `chart_${Math.random().toString(36).substring(2)}`;

  }

  render() {
console.log(this.props.chartArgs);
    if(!this.props.chartArgs.labels) return <div />;





    const { chartArgs } = this.props;

    //chartArgs.dataArr = transpose_table(chartArgs.dataArr);



const series_data =  chartArgs && chartArgs.seriesLabels && chartArgs.seriesLabels.map((x, i) => ({name: x, data: chartArgs.dataArr[i]}));

const categories_labels =            chartArgs && chartArgs.labels && chartArgs.labels.map(x => "2021-" + x.split("/").map(x => String(x).padStart(2, '0')).join("-") + "T00:00:00.000Z").map(x => (console.log(x), Date.parse(x));

console.log(series_data);
console.log(categories_labels);

    this.state = {
      series: series_data, 
      options: {
        chart: {
          id: `${this.chartId}_bar`,
          stacked: true,
          animations: { enabled: true },
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            columnWidth: '85%',
          },
        },
        xaxis: {
          type: 'datetime',
          categories:  categories_labels          ,
          labels: {
            formatter: (value) => {
              return ((new Date(value)).getMonth() + 1) + "/" + (new Date(value)).getDate();
            }
          },
        },
        legend: {
          show: true,
          position: 'top',
          offsetY: 0,
        },
        colors: CHART_FILL_COLORS,
        fill: {
          opacity: 1,
        },
      },
      optionsBrush: {
        chart: {
          id: `${this.chartId}_brush`,
          stacked: true,
          animations: { enabled: true },
          toolbar: { show: false },
          selection: { enabled: true },
          brush: {
            enabled: true,
            target: `${this.chartId}_bar`,
          },
        },
        stroke: {
          curve: 'straight',
        },
        xaxis: {
          type: 'datetime',
          categories:  categories_labels          ,
          labels: {
            formatter: (value) => {
              return ((new Date(value)).getMonth() + 1) + "/" + (new Date(value)).getDate();
            }
          },
          tooltip: { enabled: false },
        },
        legend: { show: false },
        colors: CHART_FILL_COLORS,
      },
    };










    return (
      <div>
        <div className="app">
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                height={450}
              />
            </div>
          </div>
        </div>
        <div className="app">
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={this.state.optionsBrush}
                series={this.state.series}
                type="area"
                height={150}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function transpose_table(array: number[][]) {
  return array[0].map((col, i) => array.map((row) => row[i]));
}

export default ApexStackedBarChart;
