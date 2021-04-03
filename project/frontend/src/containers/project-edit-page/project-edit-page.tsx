import React from "react";
import { Input, Button, Form, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import styles from './project-edit-page.module.less';
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { FormComponentProps } from "antd/lib/form";
import { hasErrors, isProjectNameUnique } from '../../global/form';
import SingleFileUpload from '../../components/single-file-upload/single-file-upload';
import HeaderGroup from '../../components/header-group/header-group';
import { debouncer } from "../../global/ultis";
import { createNewProject, updateProject, deleteProject, emptyCurrentProject } from "../../store/actions/project.action";

const { confirm } = Modal;

type dispatchAction = AppStore.ProjectAction | AppStore.Action;
interface Props extends RouteComponentProps<{name: string, id: string}>, FormComponentProps{
  projects: AppStore.ProjectStore;
  dispatch: ThunkDispatch<AppStore.Store, {}, dispatchAction>
}
interface State {
  isNewProject: boolean;
  uploadLoading: boolean;
}
class ProjectEditPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isNewProject: true,
      uploadLoading: false
    }
  }
  componentDidMount() {
    this.initialComponentBasedOnURL(this.props.match.params.id);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const id = this.props.match.params.id;
    const nextId = nextProps.match.params.id;
    if (id !== nextId){
      this.initialComponentBasedOnURL(nextId);
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
    const {isNewProject} = this.state;
    const {getFieldDecorator, isFieldTouched, getFieldError, getFieldsError, isFieldValidating} = this.props.form;
    const isNameError = isFieldTouched('name') && getFieldError('name');
    const isProjectNameValidating = isFieldValidating('name');

    const project = this.props.projects.currentProject.data as Project;
    const projectPath = project ? `/project/${project.name}/${project.id}` : '';
    return (
      <div className={styles['wrapper']}>
        {isNewProject ? (
          <HeaderGroup header={[{ name: 'Create new project'}]} backPath='/'/>
        ) : <HeaderGroup header={[{ name: project.name, path: projectPath}, {name: 'edit project'}]} backPath={projectPath}/>}
        <div className={styles['form']}>
          <Form>
            <Form.Item
              label="Project Name"
              className={`${styles['form__name']} ${styles['form__element']}`}
              validateStatus={isProjectNameValidating ? 'validating' : (isNameError ? 'error' : '')}
              hasFeedback={true}
              help={isProjectNameValidating ? 'Checking whether the project name is unique...' : isNameError || ''}
            >
              {
                getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Project name can\'t be empty.' }, {
                    validator: this.isProjectNameUnique
                  }]
                })(
                  <Input placeholder="Project name" />
                )}
            </Form.Item>
            <Form.Item label="Description" className={`${styles['form__description']} ${styles['form__element']}`}>
              {
                getFieldDecorator('description')(
                  <TextArea rows={4} />
                )
              }
            </Form.Item>
            {
              isNewProject ? (
                <Form.Item
                  className={`${styles['form__ifc']} ${styles['form__element']}`}
                  label="Ifc File for project"
                >
                  {getFieldDecorator('ifc', {
                    initialValue: [],
                    rules: [{ required: true, message: 'ifc file is required' }],
                  })(
                    <SingleFileUpload name="ifc" accept=".ifc" />
                  )}
                </Form.Item>
              ) : null
            }
            {
              isNewProject ? (
                <Form.Item
                  className={`${styles['form__csv']} ${styles['form__element']}`}
                  label="csv File"
                >
                  {getFieldDecorator('csv', {
                    initialValue: [],
                    rules: [{ required: true, message: 'csv file is required' }],
                  })(
                    <SingleFileUpload name="csv" accept=".csv" />
                  )}
                </Form.Item>
              ) : null
            }
          </Form>
          <div className={styles['operation-group']}>
            <Button loading={this.state.uploadLoading} onClick={isNewProject ? this.createNewProject : this.updateProject} type="primary" disabled={isProjectNameValidating || hasErrors(getFieldsError())}>{isNewProject ? 'Create' : 'Save'}</Button>
            <div style={{display: this.state.uploadLoading && isNewProject ? 'block' : 'none'}} className={styles['operation-group__loading-hint']}>The ifc is converting to obj & mtl, it may take 1 minute, please wait...</div>
            {isNewProject ? null :
              <Button onClick={this.showDeleteProjectConfirm} type="danger">Delete</Button>}
          </div>
        </div>
      </div>
    )
  }

  private initialComponentBasedOnURL(id: string | undefined) {
    if (id) {
      const currentProject = this.props.projects.currentProject.data as Project;
      this.prepareEditProject(currentProject);
    } else {
      this.prepareCreateNewProject();
    }
  }

  private prepareCreateNewProject() {
    this.setState({
      isNewProject: true
    });
    // form action
    this.setTextFieldValue();
    // set the validators
    this.isProjectNameUnique = debouncer(isProjectNameUnique([]), 1000);
    this.props.form.validateFields();
  }

  private prepareEditProject(project: Project) {
    this.setState({
      isNewProject: false
    })
    // form action
    this.setTextFieldValue(project.name, project.description);
    // set the validators
    this.isProjectNameUnique = debouncer(isProjectNameUnique([project.name]), 1000);
    this.props.form.validateFields();
  }

  private setTextFieldValue(name = '', description = '') {

    this.props.form.setFieldsValue({
      name,
      description,
    });
  }

  private createNewProject = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = new FormData();
        Object.keys(values).forEach(key => {
          if(key === 'csv' || key === 'ifc') {
            values[key].forEach((fileName: string) => {
              form.append(key, fileName)
            })
          } else {
            form.append(key, values[key]);
          }
        });
        this.setState({ uploadLoading: true });
        this.props.dispatch(createNewProject(form)).then(project => {
          this.setState({uploadLoading: false});
          setTimeout(() => {
            this.props.history.push(`/project/${project.name}/${project.id}`);
          }, 200);
        });
      }
    });
  }

  private updateProject = () => {
    this.props.form.validateFields((err, values) => {
      const id = (this.props.projects.currentProject.data as Project).id;
      this.setState({uploadLoading: true})
      this.props.dispatch(updateProject(id, values)).then((project) => {
        this.setState({uploadLoading: false})
        setTimeout(() => {
          this.props.history.replace(`/project/${project.name}/${project.id}`);
        }, 200);
      })
    })
  }

  private isProjectNameUnique = (rule: any, value: any, cb: any) => {
    cb();
  }

  private showDeleteProjectConfirm = () => {
    confirm({
      title: 'Are you sure delete this project?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const currentProject = (this.props.projects.currentProject.data) as Project;
        this.props.dispatch(deleteProject(currentProject.id));
        this.props.history.replace('');
        setTimeout(() => {
          this.props.dispatch(emptyCurrentProject());
        }, 0);
      },
      onCancel: () => {},
    });
  }
}

const extractNecessaryProps = (store: AppStore.Store) => ({
  projects: store.projects,
});
export default connect(extractNecessaryProps)(Form.create<Props>()(ProjectEditPage));