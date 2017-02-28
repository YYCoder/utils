/*
 * 时间格式转换
 * @author   yuanye
 * @date     2017-02-25
 * @param    {String||Number} [date](必选) [时间戳(数值)||日期格式字符串(如2017-10-05 13:04:55)]
 * @param    {String} [format](可选)  [想要输出的时间格式(如 %Y-%m-%d)]
 * 注: format可识别参数: %Y - 包括世纪数的十进制年份;
 *                     %m - 十进制月份（范围从 01 到 12）;
 *                     %d - 月份中的第几天，十进制数字（范围从 01 到 31）;
 *                     %w - 星期中的第几天，星期天为 0;
 *                     %H - 24 小时制的十进制小时数（范围从 00 到 23）;
 *                     %M - 十进制分钟数;
 *                     %S - 十进制秒数;
 *                     %T - 当前时间，和 %H:%M:%S 一样;
 */
function dateFormat(date, format) {
    var reg = /\%Y|\%y|\%m|\%d|\%w|\%H|\%M|\%S|\%T/g;
    var D;
    var value;
    var alter = '';
    var circle;
    function zeroFill(str) {
        str += '';
        (str.length === 1) && (str = '0' + str);
        return str
    }
    if (date) {
        D = new Date(date);
        value = format = format || "%Y-%m-%d %H:%M:%S";
        if (D.toString() !== "Invalid Date") {
            circle = reg.exec(format);
            while (circle) {
                switch (circle[0]) {
                    case "\%Y":
                        alter = D.getFullYear();
                        break;
                    case "\%m":
                        alter = zeroFill(D.getMonth() + 1);
                        break;
                    case "\%d":
                        alter = D.getDate();
                        break;
                    case "\%w":
                        alter = D.getDay();
                        break;
                    case "\%H":
                        alter = zeroFill(D.getHours());
                        break;
                    case "\%M":
                        alter = zeroFill(D.getMinutes());
                        break;
                    case "\%S":
                        alter = zeroFill(D.getSeconds());
                        break;
                    case "\%T":
                        alter = zeroFill(D.getHours())
                              + ":"
                              + zeroFill(D.getMinutes())
                              + ":"
                              + zeroFill(D.getSeconds());
                        break;
                }
                value = value.replace(circle[0], alter);
                circle = reg.exec(value);
            }
            return value;
        }
        else {
            return "Invalid Date";
        }
    }
    else {
        return false;
    }
}