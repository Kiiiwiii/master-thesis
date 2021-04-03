// http://nipponcolors.com/#aomidori
export const normalColor = '#90B44B';
export const normalColor2 = '#00896C';
export const highlightColor = '#2EA9DF';
export function normalizeDataBetweenMinandMax(originalNumber: number, min = 1, max = 100) {

  if(originalNumber === 0) {
    return {
      result: 0,
      counter: 0,
      lessThanMin: true,
      text: '0'
    }
  }

  const sign = originalNumber < 0 ? '-' : '';
  const positiveNumber = Math.abs(originalNumber);
  const lessThanMin = positiveNumber < min;
  let result = positiveNumber;
  let counter = 0;
  if (lessThanMin) {
    while (result < min) {
      counter++;
      result *= 10;
    }
  } else {
    while (result > max) {
      counter++;
      result /= 10;
    }
  }
  // toFixed(2)
  const isResultInteger = !result.toString().match(/\d+\.(\d+)/);
  result = isResultInteger ? result : +((result).toFixed(2));
  const text = counter === 0 ? `${sign}${result}` : `${sign}${result} * 10^${lessThanMin ? '-' : ''}${counter}`
  return {
    result,
    counter,
    lessThanMin,
    text
  }
}

export const shapeTypes = ['0',
  '100',
  '200',
  '300',
  '1',
  '101',
  '201',
  '301',
  '2',
  '102',
  '202',
  '302',
  '3',
  '103',
  '203',
  '303',
  '4',
  '104',
  '204',
  '304',
  '5',
  '105',
  '205',
  '305',
  '6',
  '106',
  '206',
  '306',
  '7',
  '107',
  '207',
  '307',
  '8',
  '108',
  '208',
  '308',
  '9',
  '109',
  '209',
  '309',
  '10',
  '110',
  '210',
  '310',
  '11',
  '111',
  '211',
  '311',
  '12',
  '112',
  '212',
  '312',
  '13',
  '113',
  '213',
  '313',
  '14',
  '114',
  '214',
  '314',
  '15',
  '2',
  '115',
  '2',
  '215',
  '2',
  '315',
  '2',
  '16',
  '116',
  '216',
  '316',
  '17',
  '117',
  '217',
  '317',
  '18',
  '118',
  '218',
  '318',
  '19',
  '119',
  '219',
  '319',
  '20',
  '120',
  '220',
  '320',
  '21',
  '121',
  '221',
  '321',
  '22',
  '122',
  '222',
  '322',
  '23',
  '123',
  '223',
  '323',
  '24',
  '124',
  '224',
  '324',
  '25',
  '125',
  '26',
  '126',
  '27',
  '127',
  '28',
  '128',
  '29',
  '129',
  '30',
  '130',
  '31',
  '131',
  '32',
  '132',
  '33',
  '133',
  '34',
  '134',
  '35',
  '135',
  '36',
  '136',
  '236',
  '336',
  '37',
  '137',
  '38',
  '138',
  '39',
  '139',
  '40',
  '140',
  '41',
  '141',
  '42',
  '142',
  '43',
  '143',
  '44',
  '144'];
export const colorTypes = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000']
export const allCharts: Graph[] = ['BarChart', 'LineChart', 'ParallelCoordinates', 'ScatterChart', 'ScatterPlotMatrix', 'SpiderChart', 'StackedBarChart'];