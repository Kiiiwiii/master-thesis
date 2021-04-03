import express from 'express';
import uploadRouter from './upload.router';
import bodyParser = require('body-parser');
import projectRouter from './project.router';
import visualScenarioRouter from './visualscenario.router';

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/project', projectRouter);
apiRouter.use('/visualScenario', visualScenarioRouter);

export default apiRouter;
