/**
 * @file 校验并过滤出错误行
 * @author chris<wfsr@foxmail.com>
 */

let fecs = require('fecs');

/**
 * 使用 fecs 检查所有提交涉及到的文件
 *
 * @param {Array.<File[]>} commits 所有提交的文件
 * @return {Promise.<Object>}
 */
export default function (commits) {
    let total = 0;
    let stream = require('through2').obj({highWaterMark: 100});

    commits.forEach(function (files) {
        files.forEach(function (file) {
            stream.write(file);
            total += file.stat.total;
        });
    });

    stream.end(null);

    let options = fecs.getOptions();
    options.command = 'check';
    options.stream = stream;
    options.rule = true;
    // options.lookup = false;
    options.reporter = 'baidu';

    let log = console.log;
    // console.log = function () {};

    return new Promise(function (resolve, reject) {
        let finish = function (success, json, files, errors) {
            let errorLines = json.reduce(function (count, file) {
                let map = {};

                count += file.errors.reduce(function (n, error) {
                    if (!map[error.line]) {
                        n++;
                        map[error.line] = true;
                    }
                    return n;
                }, 0);

                return count;
            }, 0);

            log('files: %s, errors: %s, changed lines: %s of %s', files, errors, errorLines, total);
            log((100 - (errorLines * 100 / total)).toFixed(2) + '%');
            resolve({success, json, files, errors, errorLines, total});
        };

        fecs.check(options, finish);
    });
}
