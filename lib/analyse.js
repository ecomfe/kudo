 * @file 分析有 diff 的行
const NEW_FILE_MODE = 'new file mode';
const CHANGED_LINE_REG = /^@@ \-\d+,\d+ \+(\d+),(\d+) @@/;
let isNewFile = function (diffs) {
    let secondLine = diffs.indexOf('\n');
function parse(diffs, isNew) {
    let lines = 0;
    let range = [];
    let line;
    let index;
    let last;
    let section;
    function push() {
    }
    return {lines, range};
}
export default function (diffs) {
    let isNew = isNewFile(diffs);
}