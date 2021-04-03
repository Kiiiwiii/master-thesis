import mongoose, { Schema, Document, Model } from 'mongoose';

export interface VisualScenarioModel extends VisualScenario, Document {}

export const modelName = 'visualScenarios';
const visualScenarioSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  projectId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  availableGraphes: {
    type: Array,
    required: true
  },
  selectedGraph: {
    type: String,
    required: true
  },
  selectedPurpose: {
    type: String,
    required: true
  },
  selectedVariables: {
    type: [{
      name: String,
      attributeType: String
    }],
    required: true
  },
  createdAt: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Number,
  }
});

visualScenarioSchema.pre('save', function(next) {
  const vs = this as any;
  if (!vs.name || vs.name === '') {
    next(new Error('visual scenario name must be provided'));
  }
  mongoose.model(modelName).findOne({name: vs.name}).then(_vs => {
    if (!_vs) {
      next();
    } else {
      next(new Error('visual scenario name must be unique'));
    }
  });
});

const visualScenarios = mongoose.model<VisualScenarioModel>(modelName, visualScenarioSchema);

class VisualScenarioDatabaseOperation {
  model: Model<VisualScenarioModel>;
  constructor(model: Model<VisualScenarioModel>) {
    this.model = model;
  }

  addVisualScenario(vs: Partial<VisualScenario>) {
    const _vs = {...vs, createdAt: new Date().getTime()};
    return new this.model(_vs).save().catch(err => Promise.reject(err || 'add visual scenario failed'));
  }

  getVisualScenarios(projectId: string) {
    return this.model.find({projectId});
  }

  getVisualScenario(id: string) {
    return this.model.findById(id);
  }

  isVisualScenarioNameUnique(name: string): Promise<boolean> {
    return this.model.findOne({name}).then(vs => !vs);
  }

  updateVisualScenario(id: string, update: Partial<VisualScenario>) {
    return this.model.findOneAndUpdate({_id: id}, {$set: update}, {new: true});
  }

  deleteVisualScenario(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}

export default new VisualScenarioDatabaseOperation(visualScenarios);
