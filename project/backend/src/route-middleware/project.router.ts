import express from 'express';
import fs from 'fs';
import projectDatabaseOperation from '../database/schema/project.schema';
import { uploadMiddleware, handleProjectDataMiddleware } from './upload.router';
const projectRouter = express.Router();
const deleteProjectRelevantFiles = (project: Project) => {
  const fileNames = [project.csvFileName];
  project.files.forEach(f => {
    fileNames.push(f.ifcFileName);
    fileNames.push(f.mtlFileName);
    fileNames.push(f.objFileName);
  });
  return new Promise((resolve, reject) => {
    let counter = 0;
    for (const fileName of fileNames) {
      fs.promises.unlink(`${__dirname}/../../files/${fileName}`).then(() => {
        counter++;
        if (counter === fileNames.length) {
          resolve('all file deleted succeed');
        }
      }).catch(() => {
        reject(`${fileName} is not deleted successfully`);
      });
    }
  });
};

projectRouter.post('/add', uploadMiddleware, handleProjectDataMiddleware, (req: any, res: any) => {
  const project = req.project as Project;
  projectDatabaseOperation.addProject(project).then(p => {
    res.send({data: p});
  }).catch(err => res.status(400).send({err}));
});

projectRouter.patch('/update', (req, res) => {
  const {id, update} = req.body;
  projectDatabaseOperation.updateProject(id, update).then(project => {
    res.send({data: project});
  }).catch(err => res.status(400).send({ err }));
});

projectRouter.delete('/delete', (req, res) => {
  const id = req.body.id as string;
  projectDatabaseOperation.deleteProject(id).then(result => {
    if (!result) {
      return Promise.reject('id is not valid');
    }
    return deleteProjectRelevantFiles(result).then(() => {
      res.send({ data: result });
    });
  }).catch(err => res.status(400).send({err}));
});

projectRouter.get('/projects', (_req, res) => {
  projectDatabaseOperation.getProjects().then(projects => {
    res.send({data: projects});
  }).catch(err => res.status(400).send(err));
});

projectRouter.get('/check-project-name', (req, res) => {
  const name = req.query.name;
  projectDatabaseOperation.isProjectNameUnique(name).then(isUnique => {
    res.send({data: isUnique});
  }).catch(err => res.status(400).send(err));
});

projectRouter.get('/project-item', (req, res) => {
  const id = req.query.id;
  projectDatabaseOperation.getProject(id).then(project => {
    res.send({data: project});
  }).catch(err => res.status(400).send({ err }));
});

export default projectRouter;
