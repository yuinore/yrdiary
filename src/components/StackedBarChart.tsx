import React, { useState } from 'react';
import { Chart, ChartWrapperOptions } from 'react-google-charts';

/*
// sample
export const data = [
  ['X-axis', 'series 1', { role: 'style' }, 'series 2', { role: 'style' }],
  ['day 1', 10, '#ff8888', 30, '#ffcc66'],
  ['day 2', 20, '#ff8888', 40, '#ffcc66'],
];
*/

export const options = {
  chart: {
    title: 'Stacked Bar Chart',
    subtitle: 'Powered by React Google Charts',
  },
  isStacked: true,

  // colors: ['#ff8888', '#ffcc66'],
};

function StackedBarChart(props: {
  args: Array<string | Array<string> | Array<Array<number>>>;
}): JSX.Element {
  if (props.args === undefined) {
    return <div />;
  }

  const [canvas_name, chart_type, labels, data_arr, series_label] = props.args;

  if (canvas_name === undefined) {
    return <div />;
  }

  const data2 = [
    ['', ...series_label],
    ...transpose_table(data_arr as Array<Array<number>>).map(
      (d: Array<number>, i: number) => [labels[i], ...d],
    ),
  ];

  return (
    <div>
      <Chart
        chartType="ColumnChart"
        data={data2}
        width="100%"
        height="400px"
        options={options}
      />
    </div>
  );
}

function transpose_table(array: Array<Array<number>>) {
  return array[0].map((col, i) => array.map((row) => row[i]));
}

export default StackedBarChart;
