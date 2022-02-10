import React, { useState } from 'react';
import StackedBarChart from './StackedBarChart';

function BarChart(props: {
  args: Array<string | string[] | number[]>;
}): JSX.Element {
  return (
    <StackedBarChart
      args={[
        props.args[0] as string,
        props.args[1] as string,
        props.args[2] as string[],
        [props.args[3] as number[]],
        ['values'],
      ]}
    />
  );
}

export default BarChart;
