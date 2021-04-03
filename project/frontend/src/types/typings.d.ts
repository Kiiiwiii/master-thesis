declare module 'react-plotly.js/factory';
declare module 'plotly.js-gl2d-dist';
declare module 'three-full';
declare module 'three-full/sources/loaders/DDSLoader';
declare module 'three-full/sources/loaders/MTLLoader';
declare module 'three-full/sources/loaders/OBJLoader';

declare namespace AppStore {
  interface Action<T = any> {
    type: string;
    payload: T;
  }

  type ProjectAction = Action<ProjectListStore | ProjectCurrentProjectStore>
  type VisualScenarioAction = Action<VisualScenariosListStore | VisualScenariosCurrentScenarioStore>

  interface Store {
    projects: ProjectStore
    visualScenarios: VisualScenarioStore
  }

  interface StoreRequest<T = any> {
    data: T;
    isFetching: boolean;
  }

  type ProjectListStore = StoreRequest<Project[]>;
  type ProjectCurrentProjectStore = StoreRequest<Project | null>;
  interface ProjectStore {
    list: ProjectListStore;
    currentProject: ProjectCurrentProjectStore;
  }

  type VisualScenariosListStore = StoreRequest<VisualisationScenario[]>
  type VisualScenariosCurrentScenarioStore = StoreRequest<VisualisationScenario | null>
  interface VisualScenarioStore {
    list: VisualScenariosListStore;
    currentScenario: VisualScenariosCurrentScenarioStore;
  }
}

interface Project {
  name: string;
  description: string;
  id: string;
  files: ArchitectureFile[];
  csvFileName: string;

  variables: Attribute[];
  sampleSize: number;
  sampleFiles: Array<{
    sampleName: string;
    image: string;
    obj: string;
    mtl: string;
  }>

  data: Data[];

  createdAt: number;
  updatedAt: number;
}

interface ArchitectureFile {
  ifcFileName: string;
  objFileName: string;
  mtlFileName: string;
}

type VariableType = 'Quantitive' | 'Nonquantitive'
type Purpose = 'Distribution' | 'Relationship' | 'Comparison'
type Graph = 'BarChart' | 'ScatterChart' | 'StackedBarChart' | 'LineChart' | 'ScatterPlotMatrix' | 'ParallelCoordinates' | 'SpiderChart'

interface VisualisationScenario {
  id: string;
  name: string;
  description: string;
  projectId: string;

  selectedVariables: Attribute[];
  selectedPurpose: Purpose;
  availableGraphes: Graph[];
  selectedGraph: Graph;

  createdAt: number;
  updatedAt: number;
}

interface Attribute {
  name: string;
  attributeType: VariableType;
}

interface Data {
  // variable name: number
  [key: string]: number | string;
  sampleName: string;
}

