import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormDraftService {
  saveDraft(formKey: string, value: any): void {
    localStorage.setItem(this.getKey(formKey), JSON.stringify(value));
  }

  loadDraft<T>(formKey: string): T | null {
    const value = localStorage.getItem(this.getKey(formKey));

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  clearDraft(formKey: string): void {
    localStorage.removeItem(this.getKey(formKey));
  }

  private getKey(formKey: string): string {
    return `dynamic-form-draft:${formKey}`;
  }
}
