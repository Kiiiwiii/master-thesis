const mapping: {
  // attribute number
  [key: number]: {
    // combination of attribute type nominal type + quantitive type
    [key: string]: {
      // sampleSize
      infinite: Array<{ purpose: Purpose, graphes: Graph[] }>
      [maxSampleSize: number]: Array<{ purpose: Purpose, graphes: Graph[] }>
    }
  }
} = {
  1: {
    '0N1Q': {
      20: [{ purpose: 'Distribution', graphes: ['BarChart'] }],
      'infinite': [{purpose: 'Distribution', graphes: ['LineChart']}]
    },
    '1N0Q': {
      'infinite': [{purpose: 'Distribution', graphes: ['ScatterChart']}]
    }
  },
  2: {
    '0N2Q': {
      20: [{ purpose: 'Distribution', graphes: ['LineChart', 'ScatterChart'] }, { purpose: 'Comparison', graphes: ['StackedBarChart'] }, { purpose: 'Relationship', graphes: ['ScatterChart'] }],
      'infinite': [{purpose: 'Distribution', graphes: ['LineChart', 'ScatterChart']},
      {purpose: 'Comparison', graphes: ['LineChart']}, {purpose: 'Relationship', graphes: ['ScatterChart']}]
    },
    '1N1Q': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ScatterChart'] }, { purpose: 'Comparison', graphes: ['ScatterChart']}, {purpose: 'Relationship', graphes: ['ScatterChart']}]
    },
    '2N0Q': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ScatterChart'] }, { purpose: 'Comparison', graphes: ['ScatterChart'] }, { purpose: 'Relationship', graphes: ['ScatterChart'] }]
    }
  },
  // 3 ~ 6
  3: {
    '0NxQ': {
      6: [{purpose: 'Distribution', graphes: ['SpiderChart']}, {purpose: 'Comparison', graphes: ['SpiderChart']}, {purpose: 'Relationship', graphes: ['ScatterPlotMatrix']}],
      20: [{ purpose: 'Distribution', graphes: ['ParallelCoordinates', 'ScatterPlotMatrix'] }, { purpose: 'Comparison', graphes: ['StackedBarChart'] }, { purpose: 'Relationship', graphes: ['ScatterPlotMatrix'] }],
      'infinite': [{ purpose: 'Distribution', graphes: ['ParallelCoordinates', 'ScatterPlotMatrix'] }, { purpose: 'Comparison', graphes: ['ParallelCoordinates', 'ScatterPlotMatrix'] }, { purpose: 'Relationship', graphes: ['ScatterPlotMatrix'] }]
    },
    'xN0Q': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ParallelCoordinates'] }, { purpose: 'Comparison', graphes: ['ParallelCoordinates'] }, { purpose: 'Relationship', graphes: ['ParallelCoordinates'] }]
    },
    'xNxQ': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ParallelCoordinates'] }, { purpose: 'Comparison', graphes: ['ParallelCoordinates'] }, { purpose: 'Relationship', graphes: ['ParallelCoordinates'] }]
    },
    '2N1Q': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ParallelCoordinates', 'ScatterChart'] }, { purpose: 'Comparison', graphes: ['ParallelCoordinates', 'ScatterChart'] }, { purpose: 'Relationship', graphes: ['ParallelCoordinates', 'ScatterChart'] }]
    },
    '1N2Q': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ParallelCoordinates', 'ScatterChart'] }, { purpose: 'Comparison', graphes: ['ParallelCoordinates', 'ScatterChart'] }, { purpose: 'Relationship', graphes: ['ParallelCoordinates', 'ScatterChart'] }]
    },
    '2N2Q': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ParallelCoordinates', 'ScatterChart'] }, { purpose: 'Comparison', graphes: ['ParallelCoordinates', 'ScatterChart'] }, { purpose: 'Relationship', graphes: ['ParallelCoordinates', 'ScatterChart'] }]
    }
  },
  // more than 6 attributes
  4: {
    'xNxQ': {
      'infinite': [{ purpose: 'Distribution', graphes: ['ParallelCoordinates'] }, { purpose: 'Comparison', graphes: ['ParallelCoordinates'] }, { purpose: 'Relationship', graphes: ['ParallelCoordinates'] }]
    }
  }
}

function getAttributeLengthKey(len: number) {
  switch (len) {
    case 1:
      return 1;
    case 2:
      return 2;
  }
  if (len >= 3 && len <= 6) {
    return 3;
  }
  return 4;
}

function getAttributeTypeKey(attributeLengthKey: number, nominalAttributeLen: number, quantitiveAttributeLen: number){
  const n = nominalAttributeLen;
  const q = quantitiveAttributeLen;

  if (attributeLengthKey === 1 || attributeLengthKey === 2) {
    return `${n}N${q}Q`
  }
  if (attributeLengthKey === 4) {
    return 'xNxQ';
  }
  // 3 ~ 6 attributes
  if (n === 0) {
    return '0NxQ'
  }
  if (q === 0) {
    return 'xN0Q'
  }
  const _set = [[1, 2], [2, 1], [2, 2]];
  if(_set.find(item => item[0] === n && item[1] === q)) {
    return `${n}N${q}Q`;
  }
  return 'xNxQ';
}

export function getAvailableGraphes(sampleSize: number, selectedVariables: Attribute[]): Array<{purpose: Purpose, graphes: Graph[]}> {
  if(selectedVariables.length === 0) {
    return [];
  }

  const nominalAttributeLen = selectedVariables.filter(v => v.attributeType === 'Nonquantitive').length;
  const quantitiveAttributeLen = selectedVariables.filter(v => v.attributeType === 'Quantitive').length;
  const attributeLen = selectedVariables.length;

  const attributeLengthKey = getAttributeLengthKey(attributeLen);
  const attributeTypeKey = getAttributeTypeKey(attributeLengthKey, nominalAttributeLen, quantitiveAttributeLen);
  const sampleSize2Graphes =  mapping[attributeLengthKey][attributeTypeKey];

  // can be 6, 20, infinite
  let fixedMaximalSize: any;
  Object.keys(sampleSize2Graphes).filter(size => !isNaN(size as any)).map(size => +size).reverse().forEach(key => {
    if(sampleSize < key) {
      fixedMaximalSize = key;
    }
  });
  const sampleSizeKey = fixedMaximalSize ? fixedMaximalSize : 'infinite';
  return sampleSize2Graphes[sampleSizeKey];
}