import React from "react";
import { Steps, Select, Button, Form, Input, Divider, Modal } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { ProjectRouterParams } from "../project-page/project-page";
import styles from './visualisation-scenario-edit-page.module.less';
import { getAvailableGraphes } from "../../global/visualisation-mapping";
import { FormComponentProps } from "antd/lib/form";
import { isVisualScenarioNameUnique, hasErrors } from "../../global/form";
import TextArea from "antd/lib/input/TextArea";
import ChartCard from "../../components/chart-card/chart-card";
import { debouncer } from "../../global/ultis";
import { createNewVisualScenario, updateVisualScenario, deleteVisualScenario, emptyCurrentVisualScenario } from "../../store/actions/visual.scenario.action";
import HeaderGroup from '../../components/header-group/header-group';
import enviroment from "../../environments/environment";

const Step = Steps.Step;
const Option = Select.Option;
const {confirm} = Modal;

export interface VisualisationScenarioRouterParams {
  vsName: string;
  vsId: string;
}
type dispatchAction = AppStore.Action;

interface Props extends RouteComponentProps<VisualisationScenarioRouterParams & ProjectRouterParams>, FormComponentProps {
  visualScenarios: AppStore.VisualScenarioStore;
  projects: AppStore.ProjectStore;
  dispatch: ThunkDispatch<AppStore.Store, {}, dispatchAction>;
}

interface State {
  isNewVisualisationScenario: boolean;
  selectedVariables: Attribute[];
  selectedPurpose: Purpose | undefined;
  selectedGraph: Graph | undefined;
  availableGraphes: Graph[];
  visualScenarioData: Data[];

  currentStepIndex: number;
  isSubmitting: boolean;
}

interface VisualisationStep {
  title: 'Select Variables' | 'Choose Graph' | 'Complete Information';
  getContent: () => JSX.Element | JSX.Element[];
  isAcessiable: () => boolean;
}

class VisualisationScenarioEditPage extends React.Component<Props, State> {

  steps: VisualisationStep[] = [{
    title: 'Select Variables',
    getContent: () => (
      <Select
        key={1}
        className={styles['content__select']}
        mode="multiple"
        value={this.state.selectedVariables.map(s => s.name)}
        placeholder="Please select variables"
        onChange={this.handleVariableSelect(this.project)}>
        <Option value="all"> - Select all </Option>
        <Option value="none"> - Deselect all </Option>
        {getSelectOptions(this.project.variables)}
      </Select>
    ),
    isAcessiable: () => true
  },
  {
    title: 'Choose Graph',
    getContent: () => {
      const { selectedVariables, selectedGraph, selectedPurpose, visualScenarioData} = this.state;
      const data = this.props.projects.currentProject.data as Project;
      const graphesWithPurpose = getAvailableGraphes(data.sampleSize, selectedVariables);
      return (
        <div style={{width: '100%'}}>
          <div className={styles['content__title']}>Recommend the following graphes based on how you want to explore the data:</div>
          {
            graphesWithPurpose.map(group => {
              return (
                <div className={styles['content__card-group']} key={group.purpose}>
                  <Divider orientation="left">{group.purpose}</Divider>
                  <div className={styles['content__card-list']}>
                    {group.graphes.map(graph => {
                      return (
                        <ChartCard
                          key={graph}
                          graph={graph}
                          data={visualScenarioData}
                          isActive={selectedGraph === graph && selectedPurpose === group.purpose}
                          chartClick={this.handleGraphandPurposeSelect(group.purpose)} />
                      )
                    })}
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    },
    isAcessiable: () => {
      const preStep = this.steps.find(s => s.title === 'Select Variables') as VisualisationStep;
      return preStep.isAcessiable() && this.state.selectedVariables.length > 0;
    }
  }, {
    title: 'Complete Information',
    getContent: () => {
      const vs = this.props.visualScenarios.currentScenario.data;
      const { getFieldDecorator, isFieldValidating, getFieldError, getFieldsError } = this.props.form;
      const isNameValidating = isFieldValidating('name');
      const isNameError = getFieldError('name');

      const {isNewVisualisationScenario, selectedVariables, selectedGraph, selectedPurpose, visualScenarioData, isSubmitting} = this.state;
      const initialName = isNewVisualisationScenario ? '' : (vs as VisualisationScenario).name;
      const initialDescription = isNewVisualisationScenario ? '' : (vs as VisualisationScenario).description;
      return (
        <div className={styles['content__summary']}>
          <div className={styles['information']}>
            <div className={styles['info-item']}>
              <div className={styles['info-item__header']}>- Selected variables:</div>
              <div className={styles['info-item__variable']}>{selectedVariables.map(v => v.attributeType === 'Nonquantitive' ? `${v.name}(n)` : v.name).join(', ')}</div>
            </div>
            <div className={styles['info-item']}>
              <div className={styles['info-item__header']}>- Selected purpose:</div>
              <div>{selectedPurpose}</div>
            </div>
            <div className={styles['info-item']}>
              <div className={styles['info-item__header']}>- Selected Graph:</div>
              <ChartCard graph={selectedGraph as Graph} isActive={true} data={visualScenarioData}/>
            </div>
          </div>
          <Form className={styles['form']}>
            <Form.Item
              label="Visual Scenario Name"
              validateStatus={isNameValidating ? 'validating' : (isNameError ? 'error' : '')}
              hasFeedback={true}
              help={isNameValidating ? 'Checking whether the visual scenario name is unique...' : isNameError || ''}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Visual scenario name can\'t be empty.' }, { validator: this.isVisualScenarioNameUnique }], initialValue: initialName
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator('description', { initialValue: initialDescription })(
                <TextArea/>
              )}
            </Form.Item>
            <div className={styles['submit-btn-group']}>
              <Button loading={isSubmitting} htmlType="button" onClick={this.handleSubmit} type="primary" disabled={isNameValidating || hasErrors(getFieldsError())}>{isNewVisualisationScenario ? 'Create' : 'Save'}</Button>
              {isNewVisualisationScenario ? null : <Button onClick={this.showDeleteVisualScenarioConfirm} type="danger">Delete</Button>}
            </div>
          </Form>
        </div>
      )
    },
    isAcessiable: () => {
      const preStep = this.steps.find(s => s.title === 'Choose Graph') as VisualisationStep;
      return preStep.isAcessiable() && !!this.state.selectedGraph;
    }
  }];

  private get project() {
    return this.props.projects.currentProject.data as Project;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      isNewVisualisationScenario: true,

      selectedVariables: [],
      selectedPurpose: undefined,
      selectedGraph: undefined,
      availableGraphes: [],
      visualScenarioData: [],

      currentStepIndex: 0,
      isSubmitting: false
    }
  }
  componentDidMount() {
    this.initialComponent(this.props.match.params.vsId);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const vsId = this.props.match.params.vsId;
    const nextvsId = nextProps.match.params.vsId;
    if (vsId !== nextvsId) {
      this.initialComponent(nextvsId);
      return false;
    }

    if (this.state !== nextState) {
      return true;
    }

    if (this.props.form !== nextProps.form) {
      return true;
    }

    return false;
  }

  render() {
    const { currentStepIndex, isNewVisualisationScenario } = this.state;
    const isNextButtonAvailable = !(currentStepIndex === this.steps.length - 1) && this.steps[currentStepIndex + 1].isAcessiable();
    const project = this.project;
    const projectPath = `/project/${project.name}/${project.id}`;
    const vs = this.props.visualScenarios.currentScenario.data as VisualisationScenario;
    const vsPath = vs ? `/project/${project.name}/${project.id}/${vs.name}/${vs.id}` : '';
    return (
      <div>
        {isNewVisualisationScenario ? (
          <HeaderGroup header={[
            { name: project.name, path: projectPath },
            { name: 'create new visual scenario' }
          ]} backPath={projectPath}/>
        ) : (
          <HeaderGroup header={[
            { name: project.name, path: projectPath },
            { name: vs.name, path: vsPath },
            { name: 'edit visual scenario'}
          ]} backPath={vsPath}/>
        )}
        <div onClick={this.navigateToHintPage} className={styles['hint']}>Learn more about how the variables to graphes mapping works</div>
        <Steps current={currentStepIndex}>
          {this.steps.map((s, i) => (
            <Step
              className={`
                ${styles['step-item']}
                ${s.isAcessiable() ? '' : styles['step-item--disabled']}
                ${s.isAcessiable() && currentStepIndex !== i ? styles['step-item--active'] : ''}
                `}
              key={s.title}
              title={s.title}
              onClick={this.handleStepIndexChange(s, i)}/>
          ))}
        </Steps>
        <div className={styles['step-control']}>
          <Button
            onClick={this.handleChangeIndexButtonClick(-1)}
            className={`
              ${styles['step-control__prev']}
              ${currentStepIndex === 0 ? styles['step-control__prev--hide'] : ''}
            `}>Previous</Button>
          <Button
            onClick={this.handleChangeIndexButtonClick(1)}
            className={`
              ${styles['step-control__next']}
              ${currentStepIndex + 1 === this.steps.length ? styles['step-control__next--hide'] : ''}
            `}
            type="primary"
            disabled={!isNextButtonAvailable}>Next</Button>
        </div>
        <div className={styles['content']}>{this.steps[currentStepIndex].getContent()}</div>
      </div>
    );
  }

  // step interaction
  private handleChangeIndexButtonClick = (change: number) => {
    return () => {
      const result = this.state.currentStepIndex + change;
      if(result > -1 && result < this.steps.length) {
        this.setState({
          currentStepIndex: this.state.currentStepIndex + change
        });
      }
    }
  }
  private handleStepIndexChange = (s: VisualisationStep, index: number) => {
    return () => {
      if (s.isAcessiable()) {
        this.setState({
          currentStepIndex: index
        });
      }
    }
  }

  // state change
  private handleGraphandPurposeSelect = (purpose: Purpose) => {
    return (graph: Graph) => {
      this.setState({
        selectedGraph: graph,
        selectedPurpose: purpose
      });
    }
  }

  private handleVariableSelect = (project: Project) => {
    return (value: string[]) => {
      const { selectedVariables, availableGraphes } = getGraphesWithPurposesBasedOnVariableValues(value, project);

      this.setState({
        selectedVariables,
        selectedGraph: undefined,
        selectedPurpose: undefined,
        availableGraphes,
        visualScenarioData: getTemporaryChartDataBasedOnSelectedVariables(selectedVariables, this.project.data)
      });
    }
  }

  // data operation
  private handleSubmit = () => {
    // work around that form can't be validated properly when initialization
    this.props.form.validateFields((err, values) => {
      const currentProject = this.project;
      if (!err) {
        this.setState({isSubmitting: true});
        const vs = {
          ...values,
          availableGraphes: this.state.availableGraphes,
          selectedGraph: this.state.selectedGraph,
          selectedPurpose: this.state.selectedPurpose,
          selectedVariables: this.state.selectedVariables,
          projectId: currentProject.id
        }
        if (this.state.isNewVisualisationScenario) {
          this.props.dispatch(createNewVisualScenario(vs)).then((visualScenario) => {
            this.setState({isSubmitting: false});
            this.props.history.push(`/project/${currentProject.name}/${currentProject.id}/${visualScenario.name}/${visualScenario.id}`);
          })
        } else {
          const id = (this.props.visualScenarios.currentScenario.data as VisualisationScenario).id;
          this.props.dispatch(updateVisualScenario(id, vs)).then(visualScenario => {
            this.setState({isSubmitting: false});
            this.props.history.push(`/project/${currentProject.name}/${currentProject.id}/${visualScenario.name}/${visualScenario.id}`);
          })
        }
      }
    })
  }

  private initialComponent(vsId: string | undefined) {
    if (vsId) {
      const currentVisualisationScenario = this.props.visualScenarios.currentScenario.data as VisualisationScenario;
      this.prepareEditPage(currentVisualisationScenario);
    } else {
      this.prepareCreateNewPage();
    }
  }
  private prepareEditPage(vs: VisualisationScenario) {
    this.setState({
      isNewVisualisationScenario: false,
      selectedVariables: vs.selectedVariables,
      selectedPurpose: vs.selectedPurpose,
      selectedGraph: vs.selectedGraph,
      availableGraphes: vs.availableGraphes,
      visualScenarioData: getTemporaryChartDataBasedOnSelectedVariables(vs.selectedVariables, this.project.data),

      currentStepIndex: 0
    });

    this.isVisualScenarioNameUnique = debouncer(isVisualScenarioNameUnique([vs.name]));
  }
  private prepareCreateNewPage() {
    this.setState({
      isNewVisualisationScenario: true,
      selectedVariables: [],
      selectedPurpose: undefined,
      selectedGraph: undefined,
      availableGraphes: [],
      visualScenarioData: [],
      currentStepIndex: 0
    });

    this.isVisualScenarioNameUnique = debouncer(isVisualScenarioNameUnique([]));
  }

  private isVisualScenarioNameUnique(rule: any, value: any, cb: any) {
    cb();
  }

  private showDeleteVisualScenarioConfirm = () => {
    confirm({
      title: 'Are you sure delete this visual scenario?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const vs = this.props.visualScenarios.currentScenario.data as VisualisationScenario;
        const project = this.props.projects.currentProject.data as Project;
        this.props.dispatch(deleteVisualScenario(vs.id));
        this.props.history.replace(`/project/${project.name}/${project.id}`);
        setTimeout(() => {
          this.props.dispatch(emptyCurrentVisualScenario());
        }, 0);
      },
      onCancel: () => { },
    });
  }

  private navigateToHintPage = () => {
    window.open(`${enviroment.endPoint}/static/mapping.pdf`, '_blank');
  }
}

const extractNecessaryProps = (store: AppStore.Store) => ({
  visualScenarios: store.visualScenarios,
  projects: store.projects
});


export const getSelectOptions = (data: Attribute[] | string[]) => {
  return (data as any[]).map((v) => {
    if (typeof v === 'object') {
      const item = v as Attribute;
      return <Option key={item.name} value={item.name}>{item.attributeType === 'Nonquantitive' ? `${item.name}(n)` : item.name}</Option>
    }
    return <Option key={v} value={v}>{v}</Option>;
  });
}

export const getGraphesWithPurposesBasedOnVariableValues = (values: string[], project: Project) => {
  const { sampleSize, variables: allVariables } = project;
  const selectedVariables = values.includes('none') ? [] : (
    values.includes('all') ? allVariables : values.map(v => {
      return allVariables.find(variable => variable.name === v) as any;
    })
  )
  const availableGraphesWithPurpose = getAvailableGraphes(sampleSize, selectedVariables);
  const availableGraphes = [...new Set(availableGraphesWithPurpose
    .reduce((acc: Graph[], cur) => {
      return [...acc, ...cur.graphes]
    }, []))];

  return {
    selectedVariables,
    availableGraphes,
    availableGraphesWithPurpose
  }
}

export const getTemporaryChartDataBasedOnSelectedVariables = (selectedVariables: Attribute[], projectData: Data[]) => {
  return projectData.map(data => {
    const result = {} as any;
    selectedVariables.forEach(variable => {
      result[variable.name] = data[variable.name];
    });
    return {
      sampleName: data.sampleName,
      ...result
    }
  });
}

export default connect(extractNecessaryProps)(Form.create<Props>()(VisualisationScenarioEditPage));