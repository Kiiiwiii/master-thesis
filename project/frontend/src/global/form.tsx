import axios from 'axios';
import enviroment from '../environments/environment';

const url = enviroment.endPoint + '/api';

export function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export function isProjectNameUnique(nameWhiteList: string[]) {
  return (rule: any, value: any, callback: any) => {
    if (!value || nameWhiteList.includes(value)) {
      callback();
      return;
    }
    axios.get(`${url}/project/check-project-name`, {
      params: {
        name: value
      }
    }).then(result => {
      if (result.data.data) {
        callback();
      } else {
        callback('project name is already taken')
      }
    });
  }
}

export function isVisualScenarioNameUnique(nameWhiteList: string[]) {
  return (rule: any, value: any, callback: any) => {
    if (!value || nameWhiteList.includes(value)) {
      callback();
      return;
    }
    axios.get(`${url}/visualScenario/check-visualScenario-name`, {
      params: {
        name: value
      }
    }).then(result => {
      if (result.data.data) {
        callback();
      } else {
        callback('project name is already taken')
      }
    })
  }
}