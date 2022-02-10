import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import ApiFetch from './components/ApiFetch';
import BarChart from './components/BarChart';
import StackedBarChart from './components/StackedBarChart';

function Hello(): JSX.Element {
  const [chartArgs1, setChartArgs1] = useState([]);
  const [chartArgs2, setChartArgs2] = useState([]);
  const [chartArgs3, setChartArgs3] = useState([]);

  const onLoadData = (markdown: string) => {
    // alert("onLoadData");
    // setRawMarkdown(markdown);
    const csv = find_all_history_with_date(markdown);
    const labels = csv.map(
      (arr) => `${arr[0].getMonth() + 1}/${arr[0].getDate()}`,
    );
    // const data = csv.map(arr => get_value_by_xpath_or_default(arr[1], "_"))
    setChartArgs1([
      'myChart',
      'bar',
      ...calc_daily_chart_data_by_xpath(csv, '_'),
    ]);
    setChartArgs2([
      'myChart6',
      'bar',
      ...calc_daily_chart_data_group_by_categories(csv, '_'),
    ]);
    setChartArgs3([
      'myChart14',
      'bar',
      ...calc_daily_chart_data_group_by_categories(csv, '_', true),
    ]);
  };

  return (
    <div>
      <h1>yrdiary</h1>
      <BarChart args={chartArgs1} />
      <StackedBarChart args={chartArgs2} />
      <StackedBarChart args={chartArgs3} />
      <ApiFetch callback={(data) => onLoadData(data)} />
    </div>
  );
}

// Property 'matchAll' does not exist on type 'string'.
// Do you need to change your target library?
// Try changing the `lib` compiler option to 'es2020' or later.
function matchAll(text: string, re: RegExp) {
  const array = [];
  let match;

  while ((match = re.exec(text))) {
    array.push(match);
  }

  return array;
}

// markdown からすべての履歴を日付付きで抽出します
// any[][] に型推論されてる？
function find_all_history_with_date(text: string) {
  const matches = Array.from(
    matchAll(text, /- ?([0-9]+)\/([0-9]+) ?({_:.+})/g),
  );
  return Array.from(
    matches.map((x) => [
      new Date(2021, Number(x[1]) - 1, Number(x[2]) - 0),
      eval(`(${x[3]})`),
    ]),
  );
}

function get_value_by_xpath_or_default(
  obj_: any,
  keys_arg: string | string[],
  def_val: any = null,
): any {
  const obj = obj_ as Record<string, any>;
  let keys = keys_arg as string[];
  if (is_string(keys_arg)) {
    keys = (keys_arg as string).split('.');
  }

  if (keys.length <= 1) {
    return obj[keys[0]] || def_val;
  }
  return get_value_by_xpath_or_default(
    (obj[keys[0]] as Record<string, any>) || {},
    keys.slice(1),
    def_val,
  );
}

function is_string(x: any) {
  return typeof x === 'string' || x instanceof String;
}

function extract_categories_from_all_history(all_history: any[][]) {
  const categories = new Set(
    all_history
      .map((arr) => Object.keys(arr[1]))
      .reduce((x, y) => Array.from(new Set([...x, ...y]))),
  );
  categories.delete('_');
  categories.delete('pigeon');
  // categories.delete("trio");
  // categories.delete("neko4");
  // categories.delete("fuyu");
  // categories.delete("candy");
  categories.delete('megu');
  categories.delete('trio2');

  return ['pigeon', 'megu', 'trio2', ...categories];
}

function parse_date(date_string: string) {
  const tokens = date_string.split('/');
  return new Date(Number(tokens[0]), Number(tokens[1]) - 1, Number(tokens[2]));
}

// -----------------------------------------------------------
// [calc_chart_data] 日別集計（累計可・期間指定可）

// markdown データから、グラフ描画用の系列を取得
// [parameter] date_from: 日付("YYYY/DD/MM" 形式)
function calc_daily_chart_data_by_xpath(
  all_history: any[][],
  xpath: string,
  cumulative = false,
  date_from: string = null,
  date_to: string = null,
) {
  let labels = all_history.map(
    (arr) => `${arr[0].getMonth() + 1}/${arr[0].getDate()}`,
  );
  let data = all_history.map((arr) => get_value_by_xpath_or_default(arr[1] as any[][], xpath));
  let sum3 = 0;

  // 期間を date_from 以降に制限
  if (date_from != null) {
    const fuyu_from = parse_date(date_from);
    let fuyu_ids = all_history
      .map((x, i) => i)
      .filter((i) => all_history[i][0] >= fuyu_from);
    if (date_to != null) {
      const fuyu_to = parse_date(date_to);
      fuyu_ids = fuyu_ids.filter((i) => all_history[i][0] <= fuyu_to);
    }

    labels = fuyu_ids.map((i) => labels[i]);
    data = fuyu_ids.map((i) => data[i]);
  }

  data = data.map(
    (x) => Math.round(
      ((sum3 = sum3 * (cumulative ? 1 : 0) + (x as number)) / 60) * 100,
    ) / 100,
  );

  return [labels, data];
}

// -----------------------------------------------------------
// [calc_chart_data] カテゴリ別日別集計系（累計可）

function calc_daily_chart_data_group_by_categories(
  all_history: any[][],
  xpath: string,
  cumulative = false,
) {
  const labels = all_history.map(
    (arr) => `${arr[0].getMonth() + 1}/${arr[0].getDate()}`,
  );
  let sum3 = 0;

  const categories = extract_categories_from_all_history(all_history);
  let data_arr = categories.map((category) => all_history.map(
    (arr) => get_value_by_xpath_or_default(arr[1], `${category}._`, null)
        || get_value_by_xpath_or_default(arr[1], category),
  ));

  data_arr = data_arr.map((data) => {
    sum3 = 0;
    return data.map(
      (x) => Math.round(((sum3 = sum3 * (cumulative ? 1 : 0) + x) / 60) * 100) / 100,
    );
  });

  return [labels, data_arr, categories];
}

export default Hello;
