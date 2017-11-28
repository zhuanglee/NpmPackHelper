const moment = require('moment');

module.exports = function format(dateObj, style='YYYY-MM-DD HH:mm:ss') { 
  return moment(dateObj).format(style);
};
