import { RequiredValidation } from "../validations/required-validation";
import { BaseFieldSchema } from "./base-field.schema";

export interface GoogleMapFieldSchema extends BaseFieldSchema {
    type: 'googleMap';
    defaultValue?: GoogleMapLocation;
    defaultCenter?: GoogleMapLocation;
    defaultZoom?: number;
    mapHeight?: string;
    markerDraggable?: boolean;
    allowMapClick?: boolean;
    validations?: RequiredValidation;
}

export interface GoogleMapLocation {
    latitude: number;
    longitude: number;
}
