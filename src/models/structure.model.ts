import mongoose, { Schema, Document } from "mongoose";
import {TStructureModel} from '@/types/types'

const ObjectId = Schema.ObjectId;

const ValidationSchema: Schema = new Schema({
  code: String,
  value: Schema.Types.Mixed,
});

const BrickSchema: Schema = new Schema({
  name: String,
  key: String,
  description: String,
  type: String,
  validations: [ValidationSchema]
});

const StructureSchema: Schema = new Schema({
  userId: {
    type: ObjectId,
    require: true
  },
  projectId: {
    type: ObjectId,
    require: true
  },
  name: String,
  code: {
    type: String,
    require: true,
    unique: true
  },
  bricks: {
    type: [BrickSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: new Date
  },
  updatedAt: {
    type: Date,
    default: new Date
  },
  enabled: {
    type: Boolean,
    default: true
  },
});

StructureSchema.set('toObject', { virtuals: true });
StructureSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Structure || mongoose.model < TStructureModel & Document > ("Structure", StructureSchema);