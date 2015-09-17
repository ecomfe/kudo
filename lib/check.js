/**
 * @file 校验并过滤出错误行
 * @author chris<wfsr@foxmail.com>
 */

import fecs from 'fecs';
import {options as cliOptions} from './config';

function formatMonth(date) {
    return date.getFullYear() * 100 + (date.getMonth() + 1);
}


/**
 * 使用 fecs 检查所有提交涉及到的文件
 *
 * @param {Array.<File[]>} commits 所有提交的文件
 * @return {Promise.<Object>}
 */
export default function (commits) {
    let through = require('through2');
    let stream = through.obj({highWaterMark: 10000});

    commits.forEach(function (files) {
        files.forEach(function (file) {
            stream.write(file);
        });
    });

    stream.end(null);


    let options = fecs.getOptions();
    options.command = 'check';
    options.stream = stream;
    options.rule = true;
    options.lookup = cliOptions.lookup;
    options.reporter = 'baidu';

    return new Promise(function (resolve, reject) {
        let meta = {lines: 0, files: 0, errors: 0, errorLines: 0};
        let collector = new Map();
        let total = Object.create(meta);

        collector.total = total;

        let finish = function (success, json, files, errors) {
            total.success = success;
            total.files = files;
            total.errors = errors;
        };

        fecs.check(options, finish).pipe(
            through.obj({highWaterMark: 10000}, function (file, enc, cb) {

                let set = new Set();
                let errorLines = file.errors.reduce(function (i, error) {
                    if (!set.has(error.line)) {
                        i++;
                        set.add(error.line);
                    }
                    return i;
                }, 0);

                let month = formatMonth(file.date);
                let monthData = collector.get(month) || Object.create(meta);

                monthData.files++;
                monthData.errors += file.errors.length;
                monthData.errorLines += errorLines;
                monthData.lines += file.stat.lines;
                total.errorLines += errorLines;
                total.lines += file.stat.lines;

                collector.set(month, monthData);

                cb(null, file);
            })
        ).once('finish', function () {
            resolve(collector);
        });
    });
}
