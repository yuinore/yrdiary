import React, { useState } from 'react';
import StackedBarChart from './StackedBarChart';

function BarChart(props: {
  args: Array<string | string[] | number[]>;
}): JSX.Element {
  const { args } = props;

  return (
    <StackedBarChart
      args={[
        args[0] as string,
        args[1] as string,
        args[2] as string[],
        [args[3] as number[]],
        ['values'],
      ]}
    />
  );
}

export default BarChart;
