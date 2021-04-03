const { Parser } = require('json2csv');
const fs = require('fs');

const fields = ['sampleName', 'Length', 'Width', 'Height', 'Wall_U', 'GFloor_U',
'Roof_U', 'Window_U', 'Window_g', 'WWR_N', 'WWR_W', 'WWR_S', 'WWR_E',
'Orientation', 'Infiltration', 'Operating_Hours', 'Cooling_Load', 'Heating_Load'];
const sample = {
  sampleName: 'sample',
  Length: [13, 16.75],
  Width: [23.35, 30.2],
  Height: [8.1, 9.9],
  Wall_U: [0.21, 0.35],
  GFloor_U: [0.2625, 0.4375],
  Roof_U: [0.15, 0.25],
  Window_U: [0.975, 1.625],
  Window_g: [0.45, 0.75],
  WWR_N: [0.225, 0.375],
  WWR_W: [0.225, 0.375],
  WWR_S: [0.225, 0.375],
  WWR_E: [0.225, 0.375],
  Orientation: [0, 360],
  Infiltration: [0.45, 0.75],
  Operating_Hours: [8, 10],
  Cooling_Load: [1775.336, 2564.345],
  Heating_Load: [4019.071, 5500.5125]
};
const data = [];

function getRandomInt(min, max) {
  return (Math.random().toFixed(3) * (max - min) + min).toFixed(3);
}

for(let i = 0; i < 30; i++) {
  const obj = {};
  Object.keys(sample).forEach((key) => {
    if (key === 'sampleName') {
      obj[key] = `${sample[key]}-${i}`;
    } else {
      obj[`${key}`] = getRandomInt(sample[`${key}`][0], sample[`${key}`][1])
    }
  });
  data.push(obj);
}
console.log(data);

const json2csvParser = new Parser({fields});
const csv = json2csvParser.parse(data);

fs.writeFile('./test.csv', csv, () => {});