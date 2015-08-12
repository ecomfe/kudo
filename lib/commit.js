/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var util = require('./util');

/**
 * 提交类
 *
 * @constructor
 * @param {Object} options 配置项
 * @param {string} options.id 提交的 id
 * @param {string} options.date 提交时间
 */
function Commit(options) {
    util.extend(this, options);
}

/**
 * 从 git-log 输出中分析生成提交实例
 *
 * @param {string} log git-log 的输出
 * @return {?Commit}
 */
Commit.from = function (log) {
    var info = log.replace(/\s*(\r?\n)+/g, '').split(',');

    if (info.length > 1) {
        return new Commit({id: info[0], date: new Date(info[1])});
    }

    return null;
};

module.exports = Commit;
