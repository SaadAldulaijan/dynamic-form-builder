import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextFieldSchema } from '../../../../models/fields/text-field.schema';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-text-control',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-control.html',
  styleUrl: './text-control.scss',
})
export class TextControl {

  @Input({ required: true }) field!: TextFieldSchema;
  @Input({ required: true }) form!: FormGroup;

  private translate = inject(TranslateService);


  get control() {
    return this.form.get(this.field.key);
  }

  isRequired(): boolean {
    return !!this.field.validations?.required;
  }

  getFieldLabel(): string {
    if (this.field.labelKey) {
      return this.translate.instant(this.field.labelKey);
    }

    return this.field.label ?? this.field.key;
  }

  getPlaceholder(): string {
    if (this.field.display?.placeholderKey) {
      return this.translate.instant(this.field.display.placeholderKey);
    }

    return '';
  }


  getControlClass(defaultClass: string): string {
    return this.field.layout?.controlClass ?? defaultClass;
  }

  getErrorMessage(): string | null {
    const control = this.form.get(this.field.key);

    if (!control?.errors) {
      return null;
    }

    const firstError = Object.keys(control.errors)[0];

    const messageKey = this.field.messageKeys?.[firstError];

    if (messageKey) {
      return this.translate.instant(messageKey);
    }

    return this.field.messages?.[firstError] ?? `${this.getFieldLabel()} is invalid`;
  }

}
