import mongoose, { Schema, Document } from "mongoose";
import {TStructureModel} from '@/types/types'

const ObjectId = Schema.ObjectId;

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
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date,
        default: new Date
    }
});

StructureSchema.set('toObject', { virtuals: true });
StructureSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Structure || mongoose.model < TStructureModel & Document > ("Structure", StructureSchema);