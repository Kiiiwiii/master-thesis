
// const fields = ['sampleName', 'Length', 'Width', 'Height', 'Wall_U', 'GFloor_U',
//   'Roof_U', 'Window_U', 'Window_g', 'WWR_N', 'WWR_W', 'WWR_S', 'WWR_E',
//   'Orientation', 'Infiltration', 'Operating_Hours', 'Cooling_Load', 'Heating_Load'];
const sample = {
  sampleName: 'sample',
  Length: [13, 16.75],
  Width: [23.35, 30.2],
  Height: [8.1, 9.9],
  Wall_U: [0.21, 0.35],
  GFloor_U: [0.2625, 0.4375],
  Door_type: ['Door_a', 'Door_b', 'Door_c', 'Door_d', 'Door_e', 'Door_f'],
  Window_type: ['Window_a', 'Window_b', 'Window_c', 'Window_d', 'Window_e', 'Window_f'],
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
} as any;

export default function getChartData(sampleSize: number, variablesSize: number) {
  const data = [] as Data[];

  function getRandomInt(min: number, max: number) {
    return +(+Math.random().toFixed(3) * (max - min) + min).toFixed(3);
  }

  for (let i = 0; i < sampleSize; i++) {
    const obj = {} as any;
    Object.keys(sample).slice(0, variablesSize + 1).forEach((key) => {
      if (key === 'sampleName') {
        obj[key] = `${sample[key]}-${i}`;
      } else if (key === 'Window_type' || key === 'Door_type') {
        obj[key] = (() => {
          const randomKey = Math.ceil(Math.random() * 6) - 1;
          switch (i % 6) {
            case 0:
              return sample[key][randomKey]
            case 1:
              return sample[key][randomKey]
            case 2:
              return sample[key][randomKey]
            case 3:
              return sample[key][randomKey]
            case 4:
              return sample[key][randomKey]
            case 5:
              return sample[key][randomKey]
          }
        })();
      } else {
        obj[`${key}`] = getRandomInt(sample[`${key}`][0], sample[`${key}`][1])
      }
    });
    data.push(obj);
  }

  return data;
}