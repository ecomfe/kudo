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
            total: result.lines
        };

        file.filter = {lines: result.range.join(','), level: 2};

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
 * @param {string} options.contents 文件内容
 */
export default class File {

    constructor(options = {cid: '', path: ''}) {
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
