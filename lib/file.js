/**
 * @file commit file
 * @author chris<wfsr@foxmail.com>
 */

import {git} from './git';
import analyse from './analyse';


/**
 * 分析变更行等信息
 *
 * @param {File} file file instance
 * @return {Promise.<File>}
 */
function bindAnalyseResult(file) {
    function bind(result) {
        file.stat = {
            size: file.contents.length,
            lines: result.lines
        };

        // HACK: 在没有增加新行（比如只删了代码行）时，lines 会为 0, range 数组为空，
        // 不处理会导致记录当前文件的全部错误，所以分配一个 0（不存在的行，行数从 1 开始）避开。
        file.filter = {lines: result.range.join(',') || '0', level: 2};

        return file;
    }

    return git.run('diff', file.cid + '^', file.cid, '--', file.path)
        .then(analyse)
        .then(bind);

}
/**
 * 简单模拟的 vinyl File
 *
 * @class
 * @param {Object} options 配置项
 * @param {string} options.cid 提交的 id
 * @param {string} options.path 文件路径
 * @param {string} options.date 文件修改时间
 * @param {string} options.contents 文件内容
 */
export default class File {

    constructor(options = {cid: '', path: '', date: null}) {
        Object.assign(this, options);
    }

    /**
     * 获取相对路径，这里跟 path 相同
     *
     * @type {string}
     */
    get relative() {
        return this.path;
    }

    /**
     * 是否为 null(永远不为 null)
     *
     * @return {boolean}
     */
    isNull() {
        return false;
    }

    /**
     * 读取文件内容并分析统计变更行等信息
     *
     * @return {Promise.<File>}
     */
    read() {
        return git.run('show', this.cid + ':' + this.path)
            .then((contents) => {
                this.contents = contents;
                return this;
            })
            .then(bindAnalyseResult);
    }

}
