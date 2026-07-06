import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DynamicFormIntegrationService {

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

    return of({
      crNumber: payload.crNumber,
      commercialName: 'Test Company for Trading',
      status: 'Active',
      city: 'Riyadh',
      activities: [
        'Energy Services',
        'Technical Consulting'
      ]
    }).pipe(delay(700));
  }

  private retrievePersonInfo(payload: any): Observable<any> {
    if (!payload.nationalId) {
      return throwError(() => new Error('National ID is required'));
    }

    return of({
      nationalId: payload.nationalId,
      fullName: 'Test Person',
      nationality: 'Saudi',
      status: 'Active'
    }).pipe(delay(700));
  }

}
