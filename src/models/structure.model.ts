import mongoose, { Schema, Document } from "mongoose";
import {TStructureModel} from '@/types/types'

const ObjectId = Schema.ObjectId;

const ValidationSchema: Schema = new Schema({
  code: String,
  type: String,
  value: Schema.Types.Mixed
}, { _id : false });

const BrickSchema: Schema = new Schema({
  name: String,
  key: String,
  description: String,
  type: String,
  validations: [ValidationSchema]
});

const NotificationSchema: Schema = new Schema({
  new: {
    alert: {
      enabled: Boolean,
      message: String
    }
  }
}, { _id : false });

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
  notifications: {
    type: NotificationSchema
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