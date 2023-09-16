import mongoose, { Schema, Document } from "mongoose";
import {TSchemaBrickModel} from '@/types/types'

const ValidationSchema: Schema = new Schema({
  code: String,
  name: String,
  desc: String,
  value: Schema.Types.Mixed,
});

const SchemaBrickSchema: Schema = new Schema({
  name: String,
  type: String,
  icon: String,
  groupCode: String,
  list: Boolean,
  validationDescHtml: String,
  validation: [ValidationSchema]
});

SchemaBrickSchema.set('toObject', { virtuals: true });
SchemaBrickSchema.set('toJSON', { virtuals: true });

export default mongoose.models.SchemaBrick || mongoose.model < TSchemaBrickModel & Document > ("SchemaBrick", SchemaBrickSchema);