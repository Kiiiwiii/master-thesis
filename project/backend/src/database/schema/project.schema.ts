import mongoose, { Document, Schema, Model } from 'mongoose';
import { modelName as visualSchemaModelName} from '../schema/visualscenario.schema';

export const projectModelName = 'projects';
export interface ProjectModel extends Project, Document {}

const projectSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  variables: {
    type: Schema.Types.Mixed,
    required: true,
  },
  sampleSize: {
    type: Number,
    required: true,
  },
  sampleFiles: {
    type: Schema.Types.Mixed,
    required: true
  },
  files: {
    type: [
      {
        ifcFileName: String,
        objFileName: String,
        mtlFileName: String,
      },
    ],
    required: true,
  },
  csvFileName: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Number,
  },
});

projectSchema.pre('save', function(next) {
  const project = this as any;
  if (!project.name || project.name === '') {
    next(new Error('project name must be provided'));
  }
  mongoose.models[projectModelName].findOne({name: project.name}).then((p) => {
    if (!p) {
      next();
    } else {
      next(new Error('project name must be unique'));
    }
  });
});

const projects = mongoose.model<ProjectModel>(projectModelName, projectSchema);

class ProjectDatabaseOperation {
  model: Model<ProjectModel>;
  constructor(model: Model<ProjectModel>) {
    this.model = model;
  }

  addProject(project: Project) {
    const p = {...project, createdAt: new Date().getTime()};
    const newProject = new this.model(p);
    return newProject.save().catch((err) => {
      return Promise.reject(err || 'add project failed');
    });
  }

  getProject(id: string) {
    return this.model.findById(id);
  }

  isProjectNameUnique(name: string): Promise<boolean> {
    return this.model.findOne({name}).then(project => {
      return !project;
    });
  }

  updateProject(id: string, update: Partial<Project>) {
    return this.model.findOneAndUpdate({_id: id}, {$set: update}, {new: true});
  }

  deleteProject(id: string) {
    return mongoose.models[visualSchemaModelName].deleteMany({projectId: id}).then(() => {
      return this.model.findOneAndDelete({ _id: id });
    });
  }

  getProjects() {
    return this.model.find();
  }
}

export default new ProjectDatabaseOperation(projects);
