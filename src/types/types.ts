import { Application } from "express";

export type RoutesInput = {
  app: Application,
}

export type TErrorResponse = {
  error: string|null;
  description?: string;
  property?: string;
}

type TValidationBrickModel = {
  code: string;
  name: string;
  value: any;
}

export type TSchemaBrickModel = {
  name: string;
  code: string;
  icon: string;
  list: boolean;
  validationDescHtml: string|null;
  validations: TValidationBrickModel[]
}

type TBrickModel = {
  name: string;
  code: string;
  validations: TValidationBrickModel[]
}

export type TStructureModel = {
  id: string;
  userId: string;
  projectId: string;
  code: string;
  name: string;
  bricks: TBrickModel[];
  createdAt: Date;
  updatedAt: Date;
}







export type TStructure = {
  id: string;
  name: string;
  code: string;
  bricks: TBrick[];
}

export type TStructureInput = {
  userId: string;
  projectId: string;
  name: string;
  code: string;
  bricks?: {
    type: string;
    name: string;
  }[]
}

type TValidationSchemaBrick = {
  code: string;
  name: string;
  desc: string;
  value: any;
}
export type TSchemaBrick = {
  id: string;
  type: string;
  name: string;
  code: string;
  icon: string;
  groupCode: string;
  list: string;
  validationDescHtml: string|null,
  validations: TValidationSchemaBrick[];
}
export type TSchemaBrickOutput = {
  id: string;
  type: string;
  name: string;
  code: string;
  icon: string;
  validations: TValidationBrick[];
}

type TValidationBrick = {
  code: string;
  value: any;
}
export type TBrick = {
  type: string;
  name: string;
  key: string;
  description: string;
  validations: TValidationBrick[];
}