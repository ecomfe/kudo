/**
 * @file cli 入口
 * @author chris<wfsr@foxmail.com>
 */

import Commit from './commit';
import check from './check';
import report from './reporter/text';


/**
 * 开始分析指定 author 在指定时间内的提交
 *
 * @param {string} name 提交代码的作者名字
 * @param {string} since git 格式的时间段表示
 */
export function deduce(name, since) {

    console.time('kudo');

    Commit.getCommits(name, since)
        .then(Commit.getFiles)
        .then(check)
        .then(report)
        .then(function () {
            console.timeEnd('kudo');
        })
        .catch(function (error) {
            console.error(error.stack);
        });
}
