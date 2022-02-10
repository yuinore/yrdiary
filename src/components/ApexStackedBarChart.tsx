import React, { Component } from 'react';
import Chart from 'react-apexcharts';

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

class ApexStackedBarChart extends React.Component {
  constructor(props) {
    super(props);

    const chartId = `chart_${Math.random().toString(36).substring(2)}`;

    this.state = {
      series: [
        {
          name: 'PRODUCT A',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'PRODUCT B',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'PRODUCT C',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'PRODUCT D',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      options: {
        chart: {
          id: `${chartId}_bar`,
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
          categories: [
            new Date('12/31/2010 GMT').getTime(),
            new Date('01/01/2011 GMT').getTime(),
            new Date('01/02/2011 GMT').getTime(),
            new Date('01/03/2011 GMT').getTime(),
            new Date('01/04/2011 GMT').getTime(),
            new Date('01/05/2011 GMT').getTime(),
          ],
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
          id: `${chartId}_brush`,
          stacked: true,
          animations: { enabled: true },
          toolbar: { show: false },
          selection: { enabled: true },
          brush: {
            enabled: true,
            target: `${chartId}_bar`,
          },
        },
        stroke: {
          curve: 'straight',
        },
        xaxis: {
          type: 'datetime',
          categories: [
            new Date('12/31/2010 GMT').getTime(),
            new Date('01/01/2011 GMT').getTime(),
            new Date('01/02/2011 GMT').getTime(),
            new Date('01/03/2011 GMT').getTime(),
            new Date('01/04/2011 GMT').getTime(),
            new Date('01/05/2011 GMT').getTime(),
          ],
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
  }

  render() {
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

export default ApexStackedBarChart;
