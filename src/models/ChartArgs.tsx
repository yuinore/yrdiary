class ChartArgs {
  constructor(args: any[]) {
    this.labels = args[0] as string[];
    this.dataArr = args[1] as number[][];
    this.seriesLabels = args[2] as string[];
  }

  labels: string[];

  dataArr: number[][];

  seriesLabels: string[];
}

export default ChartArgs;
