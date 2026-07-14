import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FormSchema } from "../models/form-schema";


@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
    private readonly http = inject(HttpClient);


    getSchema(schemaName: string): Observable<FormSchema> {
    const schemaFileName = this.toSchemaFileName(schemaName);

    return this.http.get<FormSchema>(
      `/schemas/${schemaFileName}.json`
    );
  }

  private toSchemaFileName(schemaName: string): string {
    return schemaName
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
}