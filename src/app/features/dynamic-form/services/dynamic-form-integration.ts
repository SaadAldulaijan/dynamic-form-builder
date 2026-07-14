import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DynamicFormIntegrationService {
  private readonly http = inject(HttpClient);

  execute(endpointKey: string, payload: any): Observable<any> {
    switch (endpointKey) {
      case 'retrieveCrInfo':
        return this.retrieveCrInfo(payload);

      case 'retrievePersonInfo':
        return this.retrievePersonInfo(payload);

      default:
        return throwError(() => new Error(`Unknown endpoint: ${endpointKey}`));
    }
  }

  private retrieveCrInfo(payload: any): Observable<any> {
    if (!payload.crNumber) {
      return throwError(() => new Error('CR number is required'));
    }

    return this.http.get<any>('/data/cr.json').pipe(
      map((cr) => ({
        ...cr,
        crNumber: payload.crNumber,
      }))
    );
  }

  private retrievePersonInfo(payload: any): Observable<any> {
    if (!payload.nationalId) {
      return throwError(() => new Error('National ID is required'));
    }

    const person = {
      nationalId: payload.nationalId,
      fullName: 'Test Person',
      nationality: 'Saudi',
      status: 'Active'
    };

    return of(person);
  }

}
