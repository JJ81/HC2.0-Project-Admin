const hbs = require('hbs');
const currencyFormatter = require('currency-formatter');
const dateFormat = require('dateformat');

hbs.registerHelper('isEquals', function (a, b) {
  return (a === b);
});

hbs.registerHelper('isEmpty', function (a) {
  return (a === '' || a === null);
});

hbs.registerHelper('totalCredit', function (credit, debit) {
  return parseInt(credit) - parseInt(debit);
});

hbs.registerHelper('comma-number', function (num) {
  if (num === null || isNaN(num)) {
    return 0;
  }
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

hbs.registerHelper('currency', function (num) {
  return currencyFormatter.format(num, {code: 'USD'});
});

// hbs.registerHelper('checkMinus', function (num) {
//   if (isNaN(num))
//     num = parseInt(num);
//
//   if (num.toString().indexOf('-') != -1){
//     return true;
//   }else{
//     return false;
//   }
// });

hbs.registerHelper('time', function (date) {
  if (date !== null && date !== undefined && date !== '') {
    return dateFormat(date, 'yyyy-mm-dd');
  }
  return '-';
});

hbs.registerHelper('stime', function (date) {
  return dateFormat(date, 'yyyy-mm-dd HH:MM:ss');
});

hbs.registerHelper('comparison', function (value, max) {
  return (value < max);
});

hbs.registerHelper('showContentType', (type) => {
  'use strict';
  let show_type;
  
  switch (type) {
    case 'RT':
      show_type = '대표 컨텐츠';
      break;
    case 'E':
      show_type = '교육 컨텐츠';
      break;
    case 'S':
      show_type = '요약 컨텐츠';
      break;
    case 'R':
      show_type = '추천 컨텐츠';
      break;
    default:
      show_type = '';
      break;
  }
  return show_type;
});

hbs.registerHelper('showChannelType', (type) => {
  'use strict';
  let switch_type;
  
  switch (type) {
    case 'G':
      switch_type = '단독';
      break;
    case 'U':
      switch_type = '하위';
      break;
    case 'S':
      switch_type = '대표';
      break;
    default:
      switch_type = '';
      break;
  }
  return switch_type
});


/*
 * http://bdadam.com/blog/comparison-helper-for-handlebars.html
 * 사용법 참고*/
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});