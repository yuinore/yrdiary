import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import ApiFetch from './components/ApiFetch';
import BarChart from './components/BarChart';
import StackedBarChart from './components/StackedBarChart';
import ApexStackedBarChart from './components/ApexStackedBarChart';
import ChartArgs from './models/ChartArgs';

function Hello(): JSX.Element {
  const [chartArgs1, setChartArgs1] = useState([]);
  const [chartArgs2, setChartArgs2] = useState([]);
  const [chartArgs3, setChartArgs3] = useState([]);
  const [chartArgs4, setChartArgs4] = useState([]);
  const [chartArgs5, setChartArgs5] = useState([]);
  const [chartArgs8, setChartArgs8] = useState([]);

  const onLoadData = (markdown: string) => {
    // alert("onLoadData");
    // setRawMarkdown(markdown);
    const csv = find_all_history_with_date(markdown);
    const labels = csv.map(
      (arr) => `${(arr[0] as Date).getMonth() + 1}/${(arr[0] as Date).getDate()}`,
    );
    // const data = csv.map(arr => get_value_by_xpath_or_default(arr[1], "_"))
    setChartArgs1([...calc_daily_chart_data_by_xpath(csv, '_')]);
    setChartArgs2([...calc_daily_chart_data_group_by_categories(csv, '_')]);
    setChartArgs3([
      ...calc_daily_chart_data_group_by_categories(csv, '_', true),
    ]);
    setChartArgs4([
      ...calc_period_chart_data_group_by_none(csv, '_', week_mapper),
    ]);
    setChartArgs5([
      ...calc_period_chart_data_group_by_categories(csv, '_', week_mapper),
    ]);
    setChartArgs8([
      ...calc_period_chart_data_group_by_none(csv, '_', month_mapper),
    ]);
  };

  // <ApexStackedBarChart chartArgs={new ChartArgs(chartArgs2)} />

  return (
    <div>
      <h1>yrdiary</h1>
      <BarChart args={chartArgs1} />
      <StackedBarChart args={chartArgs2} />
      <StackedBarChart args={chartArgs3} />
      <StackedBarChart args={chartArgs4} />
      <StackedBarChart args={chartArgs5} />
      <StackedBarChart args={chartArgs8} />
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
    (arr) => `${(arr[0] as Date).getMonth() + 1}/${(arr[0] as Date).getDate()}`,
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
    (arr) => `${(arr[0] as Date).getMonth() + 1}/${(arr[0] as Date).getDate()}`,
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
      (x) => Math.round(
        ((sum3 = sum3 * (cumulative ? 1 : 0) + (x as number)) / 60) * 100,
      ) / 100,
    );
  });

  return [labels, data_arr, categories];
}

// -----------------------------------------------------------
// [calc_chart_data] カテゴリ別期間集計系

// 週のはじめ（月曜日）を取得
function week_mapper(d: Date) {
  d = new Date(d);
  const diff = d.getDate() - ((d.getDay() + 6) % 7);
  d.setDate(diff);
  return d;
}

// 月の初日を取得
function month_mapper(d: Date) {
  d = new Date(d);
  d.setDate(1);
  return d;
}

type SelectorFunc = (
  arr_date: Date,
  arr_obj: any,
  xpath: string,
  category_index: number,
  category: string,
) => any;
type PeriodMapper = (day: Date) => Date;

/*
// 曜日でグルーピング
function calc_period_chart_data_group_by_weekday(
  all_history: any[][],
  xpath: string,
  cf,
  lab2: string[],
  period_mapper: PeriodMapper,
) {
  const selector_func : SelectorFunc = (
    arr_date,
    arr_obj,
    xpath,
    category_index,
    category,
  ) => {
    if (category_index == cf((arr_date.getDay() + 6) % 7)) {
      return get_value_by_xpath_or_default(arr_obj, xpath);
    }
    return 0;
  };

  return calc_chart_data_group_by_category_with_selector(
    all_history,
    xpath,
    lab2,
    selector_func,
    period_mapper,
  );
}
*/

// グルーピングしない
function calc_period_chart_data_group_by_none(
  all_history: any[][],
  xpath: string,
  period_mapper: PeriodMapper,
) {
  const lab2 = ['total'];
  const selector_func: SelectorFunc = (
    arr_date,
    arr_obj,
    xpath,
    category_index,
    category,
  ) => get_value_by_xpath_or_default(arr_obj, xpath);

  return calc_chart_data_group_by_category_with_selector(
    all_history,
    xpath,
    lab2,
    selector_func,
    period_mapper,
  );
}

// 第一階層のキーでグルーピング
function calc_period_chart_data_group_by_categories(
  all_history: any[][],
  xpath: string,
  period_mapper: PeriodMapper,
) {
  const lab2 = extract_categories_from_all_history(all_history);
  const selector_func: SelectorFunc = (
    arr_date,
    arr_obj,
    xpath,
    category_index,
    category,
  ) => get_value_by_xpath_or_default(arr_obj, `${category}._`, null)
    || get_value_by_xpath_or_default(arr_obj, category);

  return calc_chart_data_group_by_category_with_selector(
    all_history,
    xpath,
    lab2,
    selector_func,
    period_mapper,
  );
}

// -----------------------------------------------------------

// Note: xpath は selector_func の引数としてしか使用していない
function calc_chart_data_group_by_category_with_selector(
  all_history: any[][],
  xpath: string,
  lab2: string[],
  selector_func: SelectorFunc,
  period_mapper: PeriodMapper,
) {
  const labels = all_history.map(
    (arr) => `${arr[0].getMonth() + 1}/${arr[0].getDate()}`,
  );
  const data_arr = lab2.map((category: string, category_index: number) => all_history.map((arr) => selector_func(arr[0], arr[1], xpath, category_index, category)));

  const d_from = new Date(2021, 1 - 1, 1);
  const d_to = new Date(
    2021,
    all_history[all_history.length - 1][0].getMonth(),
    all_history[all_history.length - 1][0].getDate(),
  );

  const dict = lab2.map((_): Record<string, number> => ({}));
  const dict_week = lab2.map((_): Record<string, number> => ({}));
  const data_arr2 = lab2.map((_): number[] => []);

  for (var c_i = 0; c_i < lab2.length; c_i++) {
    for (
      var day = new Date(d_from.getTime());
      day <= d_to;
      day.setDate(day.getDate() + 1)
    ) {
      dict_week[c_i][d_f_d(period_mapper(day))] = 0;
    }
  }

  for (var c_i = 0; c_i < lab2.length; c_i++) {
    labels.forEach((x, i) => (dict[c_i][x] = data_arr[c_i][i]));

    for (
      var day = new Date(d_from.getTime());
      day <= d_to;
      day.setDate(day.getDate() + 1)
    ) {
      dict_week[c_i][d_f_d(period_mapper(day))] = (dict_week[c_i][d_f_d(period_mapper(day))] || 0)
        + (dict[c_i][d_f_d(day)] || 0);
    }

    // update!!
    data_arr2[c_i] = Object.values(dict_week[c_i]).map(
      (x) => Math.round((x / 60) * 100) / 100,
    );
  }

  const labels2 = Object.keys(dict_week[0]).map((x) => `${x}〜`);

  return [labels2, data_arr2, lab2];
}

// object のキーとして使うため、
// Date オブジェクトを "MM/dd" 形式の文字列に変換
function d_f_d(date_object: Date) {
  return `${date_object.getMonth() + 1}/${date_object.getDate()}`;
}

export default Hello;
