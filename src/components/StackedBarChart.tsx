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
  colors: [
    '#f88888',
    '#f8bb66',
    '#ddcc00',
    '#88dd88',
    '#88dddd',
    '#44aaee',
    '#7777f8',
    '#dd66dd',
    '#dddddd',
    '#aaaaaa',
    '#666666',
  ],
  showToolTip: true,

  bar: { groupWidth: '85%' },
  legend: { position: 'top' },
};

function StackedBarChart(props: {
  args: Array<string | string[] | number[][]>;
}): JSX.Element {
  const { args } = props;

  if (args === undefined) {
    return <div />;
  }

  const [canvas_name, chart_type, labels, data_arr, series_label] = args;

  if (canvas_name === undefined) {
    return <div />;
  }

  const data2 = [
    ['', ...series_label],
    ...transpose_table(data_arr as number[][]).map(
      (d: number[], i: number) => [labels[i], ...d],
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

function transpose_table(array: number[][]) {
  return array[0].map((col, i) => array.map((row) => row[i]));
}

export default StackedBarChart;
