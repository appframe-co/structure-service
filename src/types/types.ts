import { Application } from "express";
import { SortOrder } from "mongoose";

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
  type: string;
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
  id: string;
  type: string;
  name: string;
  key: string;
  description: string;
  validations: TValidationBrickModel[]
}

export type TStructureModel = {
  id: string;
  userId: string;
  projectId: string;
  code: string;
  name: string;
  bricks: TBrickModel[];
  notifications: {
    new: {
      alert: {
        enabled: boolean;
        message: string
      }
    }
  };
  translations: {
    enabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}







export type TStructure = {
  id: string;
  name: string;
  code: string;
  bricks: TBrick[];
  notifications: {
    new: {
      alert: {
        enabled: boolean;
        message: string
      }
    }
  };
  translations: {
    enabled: boolean;
  };
}

export type TStructureInput = {
  userId: string;
  projectId: string;
  id?: string;
  name: string;
  code: string;
  bricks?: {
    type: string;
    name: string;
  }[];
  notifications?: {
    new: {
      alert: {
        enabled: boolean;
        message: string
      }
    }
  };
  translations?: {
    enabled: boolean;
  };
}

type TValidationSchemaBrick = {
  code: string;
  name: string;
  desc: string;
  value: any;
  type: string;
  presetChoices: {name: string, value: string}[];
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
  type: string;
  code: string;
  value: any;
}
export type TBrick = {
  id: string;
  type: string;
  name: string;
  key: string;
  description: string;
  validations: TValidationBrick[];
}

export type TParameters = {
  limit?: number;
  sinceId?: string;
  code?: string;
}

export type TSort = {[key: string]: SortOrder};