import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import ApiFetch from './components/ApiFetch';
import StackedBarChart from './components/StackedBarChart';

function Hello(): JSX.Element {
  const [chartArgs, setChartArgs] = useState([]);

  const onLoadData = (markdown: string) => {
    //alert("onLoadData");
    // setRawMarkdown(markdown);
    const csv = find_all_history_with_date(markdown);
    const labels = csv.map(
      (arr) => arr[0].getMonth() + 1 + '/' + arr[0].getDate(),
    );
    //const data = csv.map(arr => get_value_by_xpath_or_default(arr[1], "_"))
    const chart_args = [
      'myChart6',
      'bar',
      ...calc_daily_chart_data_group_by_categories(csv, '_'),
    ];

    setChartArgs(chart_args);
  };

  return (
    <div>
      <StackedBarChart args={chartArgs} />
      <ApiFetch callback={(data) => onLoadData(data)} />
    </div>
  );
}

// Property 'matchAll' does not exist on type 'string'.
// Do you need to change your target library?
// Try changing the `lib` compiler option to 'es2020' or later.
function matchAll(text: string, re: RegExp) {
  let array = [];
  let match;

  while ((match = re.exec(text))) {
    array.push(match);
  }

  return array;
}

// markdown からすべての履歴を日付付きで抽出します
function find_all_history_with_date(text: string) {
  var matches = Array.from(matchAll(text, /- ?([0-9]+)\/([0-9]+) ?({_:.+})/g));
  return Array.from(
    matches.map((x) => {
      return [
        new Date(2021, Number(x[1]) - 1, Number(x[2]) - 0),
        eval('(' + x[3] + ')'),
      ];
    }),
  );
}

function get_value_by_xpath_or_default(obj, keys, def_val = 0) {
  if (is_string(keys)) {
    keys = keys.split('.');
  }

  if (keys.length <= 1) {
    return obj[keys[0]] || def_val;
  } else {
    return get_value_by_xpath_or_default(
      obj[keys[0]] || {},
      keys.slice(1),
      def_val,
    );
  }
}

function is_string(x) {
  return typeof x == 'string' || x instanceof String;
}

function extract_categories_from_all_history(all_history) {
  var categories = all_history
    .map((arr) => Object.keys(arr[1]))
    .reduce((x, y) => new Set([...x, ...y]));
  categories.delete('_');
  categories.delete('pigeon');
  //categories.delete("trio");
  //categories.delete("neko4");
  //categories.delete("fuyu");
  //categories.delete("candy");
  categories.delete('megu');
  categories.delete('trio2');

  return ['pigeon', 'megu', 'trio2', ...categories];
}

// -----------------------------------------------------------
// [calc_chart_data] カテゴリ別日別集計系（累計可）

function calc_daily_chart_data_group_by_categories(
  all_history,
  xpath,
  cumulative = false,
  date_from = null,
) {
  var labels = all_history.map(
    (arr) => arr[0].getMonth() + 1 + '/' + arr[0].getDate(),
  );
  var sum3 = 0;

  var categories = extract_categories_from_all_history(all_history);
  var data_arr = categories.map((category) =>
    all_history.map(
      (arr) =>
        get_value_by_xpath_or_default(arr[1], category + '._', null) ||
        get_value_by_xpath_or_default(arr[1], category),
    ),
  );

  data_arr = data_arr.map((data) => {
    sum3 = 0;
    return data.map(
      (x) =>
        Math.round(((sum3 = sum3 * (!!cumulative - 0) + x) / 60) * 100) / 100,
    );
  });

  return [labels, data_arr, categories];
}

export default Hello;
