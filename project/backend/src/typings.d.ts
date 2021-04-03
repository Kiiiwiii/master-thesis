interface Project {
  name: string;
  description: string;

  variables: {name: string, attributeType: VariableType};
  sampleSize: number;
  sampleFiles: Array<{
    sampleName: string;
    image: string;
    obj: string;
    mtl: string;
  }>

  files: ArchitectureFile[];
  csvFileName: string;
  data: any;
  createdAt: number;
  updatedAt?: number;

  // @TODO we can have it after we have users feature
  // userId: string;
}

interface VisualScenario {
  name: string;
  description: string;
  projectId: string;

  availableGraphes: string[];
  selectedGraph: string;
  selectedPurpose: string;
  selectedVariables: { name: string, attributeType: VariableType }[];

  createdAt: number;
  updatedAt?: number;
}

interface ArchitectureFile {
  ifcFileName: string;
  objFileName: string;
  mtlFileName: string;
}

type VariableType = 'Quantitive' | 'Nonquantitive'