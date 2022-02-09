import * as React from 'react';
import { Chart } from 'react-google-charts';

export const data = [
  ['X-axis', 'series 1', { role: 'style' }, 'series 2', { role: 'style' }],
  ['day 1', 10, '#ff8888', 30, '#ffcc66'],
  ['day 2', 20, '#ff8888', 40, '#ffcc66'],
];

export const options = {
  chart: {
    title: 'Stacked Bar Chart',
    subtitle: 'Powered by React Google Charts',
  },
  isStacked: true,

  colors: ['#ff8888', '#ffcc66'],
};

function Hello(): JSX.Element {
  return (
    <Chart
      chartType='ColumnChart'
      data={data}
      width='100%'
      height='400px'
      options={options}
    />
  );
}

export default Hello;
