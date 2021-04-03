import express from 'express';
import visualScenarioDatabaseOperation from '../database/schema/visualscenario.schema';
const visualScenarioRouter = express.Router();

visualScenarioRouter.post('/add', (req: any, res) => {
  const {visualScenario} = req.body;
  visualScenarioDatabaseOperation.addVisualScenario(visualScenario)
    .then(vs => res.send({data: vs})).catch(err => res.status(400).send({err}));
});

visualScenarioRouter.get('/visualScenarios', (req: any, res) => {
  const {projectId} = req.query;
  visualScenarioDatabaseOperation.getVisualScenarios(projectId)
    .then(data => res.send({data})).catch(err => res.status(400).send({err}));
});

visualScenarioRouter.get('/visualScenario', (req: any, res) => {
  const {id} = req.query;
  visualScenarioDatabaseOperation.getVisualScenario(id)
    .then(data => res.send({ data })).catch(err => res.status(400).send({ err }));
});

visualScenarioRouter.get('/check-visualScenario-name', (req: any, res) => {
  const {name} = req.query;
  visualScenarioDatabaseOperation.isVisualScenarioNameUnique(name)
    .then(isUnique => res.send({data: isUnique})).catch(err => res.status(400).send(err));
});

visualScenarioRouter.patch('/update', (req, res) => {
  const {id, update} = req.body;
  visualScenarioDatabaseOperation.updateVisualScenario(id, update)
    .then(vs => res.send({data: vs}))
    .catch(err => res.status(400).send({err}));
});

visualScenarioRouter.delete('/delete', (req, res) => {
  const {id} = req.body;
  visualScenarioDatabaseOperation.deleteVisualScenario(id).then(result => {
    if (!result) {
      return Promise.reject('id is not valid');
    }
    res.send({ data: result });
  }).catch(err => res.status(400).send({ err }));
});

export default visualScenarioRouter;
