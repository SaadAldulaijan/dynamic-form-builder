import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Schema } from "../models/schema";

@Injectable({
    providedIn: 'root',
})
export class SchemaService {

    private readonly http = inject(HttpClient);

    getSchemaList(): Observable<Schema[]> {
        return this.http.get<Schema[]>('/schemas/schemas.json');
    }
}