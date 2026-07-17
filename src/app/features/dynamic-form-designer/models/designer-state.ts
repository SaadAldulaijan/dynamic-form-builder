import { FormSchema } from "../../dynamic-form/models/form-schema";
import { DesignerNode } from "./designer-node";

export interface DesignerState {
  schema: FormSchema;
  selectedNode: DesignerNode | null;
  isDirty: boolean;
}