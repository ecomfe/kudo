/**
 * @file 控制台文本 Reporter
 * @author chris<wfsr@foxmail.com>
 */

import Table from 'tty-table';
import chalk from 'chalk';

function percent(value) {
    let rate = (100 - value.errorLines * 100 / value.lines);
    let color = 'red';
    if (rate > 98) {
        color = 'green';
    }
    else if (rate > 80) {
        color = 'yellow';
    }

    return chalk[color](rate.toFixed(2));
}

function date(value) {
    value = value + '';
    return value.slice(0, 4) + '-' + value.slice(4);
}

function format(collector) {
    let rows = [];

    for (let [key, value] of collector) {
        rows.push([date(key), value.files, value.lines, value.errors, value.errorLines, percent(value)]);
    }

    rows.sort(function (a, b) {
        return a[0] > b[0];
    });

    let total = collector.total;
    rows.push(['Total', total.files, total.lines, total.errors, total.errorLines, percent(total)]);

    return rows;
}

export default function (collector) {
    let header = [
        {
            value: 'Date',
            width: 25
        },
        {
            value: 'Files',
            width: 15
        },
        {
            value: 'Lines',
            width: 15
        },
        {
            value: 'Errors',
            width: 15,
            headerColor: 'yellow',
            color: 'red',
            formatter: function (value) {
                return chalk[value ? 'red' : 'green'](value);
            }
        },
        {
            value: 'ErrorLines',
            width: 15,
            headerColor: 'yellow',
            color: 'red',
            formatter: function (value) {
                return chalk[value ? 'red' : 'green'](value);
            }
        },
        {
            value: '% Rate',
            width: 15
        }
    ];

    let table = new Table(header, format(collector));
    console.log(table.render());

    return collector;
}
