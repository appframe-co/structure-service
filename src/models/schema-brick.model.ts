import mongoose, { Schema, Document } from "mongoose";
import {TSchemaBrickModel} from '@/types/types'

const PresetChoiceSchema: Schema = new Schema({
  name: String,
  value: String
}, { _id : false });

const ValidationSchema: Schema = new Schema({
  code: String,
  name: String,
  desc: String,
  type: String,
  value: Schema.Types.Mixed,
  presetChoices: [PresetChoiceSchema]
});

const SchemaBrickSchema: Schema = new Schema({
  name: String,
  type: String,
  icon: String,
  groupCode: String,
  list: Boolean,
  validationDescHtml: String,
  validations: [ValidationSchema]
});

SchemaBrickSchema.set('toObject', { virtuals: true });
SchemaBrickSchema.set('toJSON', { virtuals: true });

export default mongoose.models.SchemaBrick || mongoose.model < TSchemaBrickModel & Document > ("SchemaBrick", SchemaBrickSchema);