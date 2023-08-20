import { Application } from "express";

export type RoutesInput = {
  app: Application,
}

export type TErrorResponse = {
  error: string|null;
  description?: string;
  property?: string;
}

export type TStructureModel = {
  id: string;
  userId: string;
  projectId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TStructure = {
    id: string;
    name: string;
}

export type TStructureInput = {
  userId: string;
  projectId: string;
  name: string;
  code: string;
}

export type TStructureOutput = {
  id: string;
  name: string;
}