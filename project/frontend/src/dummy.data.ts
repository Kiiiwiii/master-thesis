import getChartData from "./dummy.chart.data";

export const projects: any[] = [{
  name: 'ThousandBuilding-1',
  description: 'some text',
  id: '1',
  csvFileName: 'csv1',
  files: [
    {ifcFileName: 'ifc1', objFileName: 'obt1', mtlFileName: 'mtl1'},
    {ifcFileName: 'ifc2', objFileName: 'obt2', mtlFileName: 'mtl2'},
    {ifcFileName: 'ifc3', objFileName: 'obt3', mtlFileName: 'mtl3'},
    {ifcFileName: 'ifc4', objFileName: 'obt4', mtlFileName: 'mtl4'}
  ],
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
  variables: [{name: 'Length', attributeType: 'Quantitive'}, {name: 'Width', attributeType: 'Quantitive'},
    {name: 'Height', attributeType: 'Quantitive'}, {name: 'Wall_U', attributeType: 'Quantitive'}, {name: 'Cooling_load', attributeType: 'Quantitive'},
    { name: 'Window_type', attributeType: 'Nonquantitive' }, { name: 'Door_type', attributeType: 'Nonquantitive' }, { name: 'Roof_type', attributeType: 'Nonquantitive' }],
  sampleSize: 100,
  data: getChartData(100, 15)
}, {
    name: 'ThousandBuilding-2',
    description: 'Build in Munich',
    id: '2',
    csvFileName: 'csv2',
    files: [
      { ifcFileName: 'ifc21', objFileName: 'obt21', mtlFileName: 'mtl21'},
      { ifcFileName: 'ifc22', objFileName: 'obt22', mtlFileName: 'mtl22'},
      { ifcFileName: 'ifc23', objFileName: 'obt23', mtlFileName: 'mtl23'},
      { ifcFileName: 'ifc24', objFileName: 'obt24', mtlFileName: 'mtl24'}
    ],
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    variables: [{ name: 'Length', attributeType: 'Quantitive' }, { name: 'Width', attributeType: 'Quantitive' },
    { name: 'Height', attributeType: 'Quantitive' }, { name: 'Wall_U', attributeType: 'Quantitive' }, { name: 'Cooling_load', attributeType: 'Quantitive' },
    { name: 'Window_type', attributeType: 'Nonquantitive' }, { name: 'Door_type', attributeType: 'Nonquantitive' }],
    sampleSize: 15,
    data: getChartData(100, 15)
  }, {
    name: 'ThousandBuilding-3',
    description: 'Build in Munich',
    id: '3',
    csvFileName: 'csv3',
    files: [
      { ifcFileName: 'ifc31', objFileName: 'obt31', mtlFileName: 'mtl31'},
      { ifcFileName: 'ifc32', objFileName: 'obt32', mtlFileName: 'mtl32'},
      { ifcFileName: 'ifc33', objFileName: 'obt33', mtlFileName: 'mtl33'},
      { ifcFileName: 'ifc34', objFileName: 'obt34', mtlFileName: 'mtl34'}
    ],
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    variables: [{ name: 'Length', attributeType: 'Quantitive' }, { name: 'Width', attributeType: 'Quantitive' },
    { name: 'Height', attributeType: 'Quantitive' }, { name: 'Wall_U', attributeType: 'Quantitive' }, { name: 'Cooling_load', attributeType: 'Quantitive' },
    { name: 'Window_type', attributeType: 'Nonquantitive' }, { name: 'Door_type', attributeType: 'Nonquantitive' }],
    sampleSize: 100,
    data: getChartData(100, 15)
  }];

export const scenarios: VisualisationScenario[] = (() => {
  const _scenarios: VisualisationScenario[] = [];
  for(let i = 0; i < 10; i++) {
    _scenarios.push({
      id: i + '',
      name: `Visual Scenario ${i}`,
      description: `Some description for visual scenario ${i}`,
      projectId: i % 2 === 0 ? '1' : '2',
      selectedVariables: [{ name: 'Length', attributeType: 'Quantitive' }, { name: 'Width', attributeType: 'Quantitive' },
      { name: 'Height', attributeType: 'Quantitive' }, { name: 'Wall_U', attributeType: 'Quantitive' }, { name: 'Cooling_load', attributeType: 'Quantitive' },
      { name: 'Window_type', attributeType: 'Nonquantitive' }, { name: 'Door_type', attributeType: 'Nonquantitive' }],
      availableGraphes: ['ParallelCoordinates', 'ScatterChart'],
      // change here to test the charts
      selectedPurpose: 'Distribution',
      selectedGraph: 'SpiderChart',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });
  }
  return _scenarios;
})();