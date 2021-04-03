import moment from 'moment';
// @TODO, extend options if necessary
function DatePipe(date: Date | number | string, options = 'MMMM Do YYYY') {
  return moment(date).format(options);
}

export default DatePipe;