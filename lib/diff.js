/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

var util = require('./util');
var analyse = require('./analyse');

/**
 * 分析提交中文件的变更信息
 *
 * @param {Object} file  模拟文件对象
 * @param {function(Object)} done 用分析后的文件对象调用的回调函数
 */
module.exports = function (file,  done) {

    var finish = function (diffs) {
        var result = analyse(diffs);

        file.stat = {
            size: file.contents.length,
            total: result.lines
        };

        file.filter = {lines: result.range.join(','), level: 2};

        done(file);
    };

    util.git(
        ['diff', file.cid + '^', file.cid, '--', file.path],
        finish
    );
};
