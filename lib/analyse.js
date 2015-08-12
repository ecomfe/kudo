/**
 * @file 校验错误信息输出
 * @author chris<wfsr@foxmail.com>
 */

'use strict';

/**
 * 新文件的标志
 *
 * @const
 * @type {string}
 */
var NEW_FILE_MODE = 'new file mode';

/**
 * 匹配 diff 中的行数的正则
 *
 * @const
 * @type {RegExp}
 */
var CHANGED_LINE_REG = /^@@ \-\d+,\d+ \+(\d+),(\d+) @@/;

/**
 * 是否新增文件
 *
 * @param {string} diffs diff 输出的字符
 * @return {boolean}  是否新增加文件的结果
 */
var isNewFile = function (diffs) {
    var secondLine = diffs.indexOf('\n');
    return diffs.substr(secondLine + 1, NEW_FILE_MODE.length) === NEW_FILE_MODE;
};

/**
 * 从 diff 输出中解释出有改变的行数及适用于 `fecs --lines` 过滤的 range
 *
 * @param {string} diffs  diff 的输出字符
 * @param {boolean} isNew 是否新文件
 * @return {Object} 包含变更行数 lines 及 range 的对象
 */
var parse = function (diffs, isNew) {
    diffs = diffs.slice(diffs.indexOf('@@')).split(/\r?\n/);

    var lines = 0;
    var range = [];
    var line;
    var index;
    var last;
    var section;

    var push = function () {
        if (!section || !section[0]) {
            return;
        }

        if (section[1]) {
            if (section[1] - section[0] < 2) {
                range.push(section[0]);
                range.push(section[1]);
            }
            else {
                range.push('[' + section + ']');
            }
        }
        else {
            range.push(section[0]);
        }

        section.length = 0;
    };

    while ((line = diffs.shift())) {
        var match = line.match(CHANGED_LINE_REG);
        if (match) {
            if (isNew) {
                lines = match[2] | 0;
                break;
            }
            index = match[1] | 0;
        }
        else {
            switch (line[0]) {
                case '-':
                    break;
                case '+':
                    if (last) {
                        if (index === last + 1) {
                            last = index;
                            section[1] = last + '';
                        }
                        else {
                            last = 0;
                            push();
                        }
                    }
                    else {
                        last = index;
                        section = [last + ''];
                    }
                    lines++;
                    index++;
                    break;
                default:
                    index++;
                    last = 0;
                    push();
                    break;
            }
        }
    }

    if (section && section.length) {
        push();
    }

    return {lines: lines, range: range};

};

/**
 * 从 diff 输出中分析
 *
 * @param {string} diffs diff 的输出
 * @return {Object} 包含变更行数 lines 及 range 的对象
 */
module.exports = function (diffs) {
    var isNew = isNewFile(diffs);
    return parse(diffs, isNew);
};
