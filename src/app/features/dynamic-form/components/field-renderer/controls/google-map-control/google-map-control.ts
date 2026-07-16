import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { GoogleMap, MapMarker } from '@angular/google-maps';
import { ValidationMessageCode } from '../../../../models/fields/base-field.schema';
import { GoogleMapFieldSchema, GoogleMapLocation } from '../../../../models/fields/google-map-field.schema';

@Component({
  selector: 'app-google-map-control',
  imports: [CommonModule, ReactiveFormsModule, GoogleMap, MapMarker],
  templateUrl: './google-map-control.html',
  styleUrls: ['./google-map-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleMapControl {
  readonly field = input.required<GoogleMapFieldSchema>();
  readonly form = input.required<FormGroup>();

  private translate = inject(TranslateService);

  private readonly riyadhLocation: GoogleMapLocation = {
    latitude: 24.7136,
    longitude: 46.6753,
  };

  private readonly langChange = toSignal(this.translate.onLangChange.pipe(startWith(null)), {
    initialValue: null,
  });

  readonly control = computed(() => {
    const currentForm = this.form();
    const currentField = this.field();

    return currentForm.get(currentField.key);
  });

  private readonly controlState = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) => {
        if (!control) {
          return of(null);
        }

        return merge(control.statusChanges, control.valueChanges, control.events).pipe(startWith(null));
      }),
    ),
    { initialValue: null },
  );

  readonly value = computed<GoogleMapLocation | null>(() => {
    this.controlState();

    return this.toLocation(this.control()?.value);
  });

  readonly center = computed(() => {
    const location = this.value() ?? this.field().defaultCenter ?? this.riyadhLocation;

    return {
      lat: location.latitude,
      lng: location.longitude,
    };
  });

  readonly mapHeight = computed(() => {
    return this.field().mapHeight ?? '400px';
  });

  readonly zoom = computed(() => {
    return this.field().defaultZoom ?? 8;
  });

  readonly markerPosition = computed<google.maps.LatLngLiteral | null>(() => {
    const location = this.value();

    if (!location) {
      return null;
    }

    return {
      lat: location.latitude,
      lng: location.longitude,
    };
  });

  readonly markerOptions = computed<google.maps.MarkerOptions>(() => {
    return {
      draggable: this.field().markerDraggable === true && !this.isReadonly(),
    };
  });

  readonly mapOptions = computed<google.maps.MapOptions>(() => {
    return {
      clickableIcons: false,
      gestureHandling: this.isReadonly() ? 'none' : 'auto',
      keyboardShortcuts: !this.isReadonly(),
    };
  });

  readonly fieldLabel = computed(() => {
    this.langChange();
    const currentField = this.field();

    return this.text(currentField.label, currentField.labelKey);
  });

  readonly isRequired = computed(() => {
    this.controlState();
    const control = this.control();

    if (!control) {
      return false;
    }

    return control.hasValidator(Validators.required);
  });

  readonly labelClass = computed(() => {
    return this.field().layout?.labelClass ?? 'form-label';
  });

  readonly errorClass = computed(() => {
    return this.field().layout?.errorClass ?? 'text-danger small mt-1';
  });

  readonly showError = computed(() => {
    this.controlState();
    const control = this.control();

    return !!(control?.touched && control.invalid);
  });

  readonly errorMessage = computed(() => {
    this.langChange();
    this.controlState();
    const control = this.control();

    if (!control?.errors) {
      return null;
    }

    const firstError = Object.keys(control.errors)[0] as ValidationMessageCode;
    const currentField = this.field();
    const messageKey = currentField.messageKeys?.[firstError];

    if (messageKey) {
      return this.translate.instant(messageKey);
    }

    return currentField.messages?.[firstError] ?? `${this.fieldLabel()} is invalid`;
  });

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (this.field().allowMapClick === false || this.isReadonly()) {
      this.markAsTouched();
      return;
    }

    this.setLocationFromEvent(event);
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (this.field().markerDraggable === false || this.isReadonly()) {
      return;
    }

    this.setLocationFromEvent(event);
  }

  markAsTouched(): void {
    const control = this.control();

    if (!control) {
      return;
    }

    control.markAsTouched();
    control.updateValueAndValidity();
  }

  text(label?: string, labelKey?: string): string {
    return labelKey ? this.translate.instant(labelKey) : (label ?? '');
  }

  private setLocationFromEvent(event: google.maps.MapMouseEvent): void {
    const latLng = event.latLng?.toJSON();
    const control = this.control();

    if (!latLng || !control) {
      return;
    }

    control.setValue({
      latitude: latLng.lat,
      longitude: latLng.lng,
    });

    control.markAsTouched();
    control.updateValueAndValidity();
  }

  private isReadonly(): boolean {
    const control = this.control();
    const fieldState = this.field().state;

    return fieldState?.readonly === true || fieldState?.disabled === true || control?.disabled === true;
  }

  private toLocation(value: unknown): GoogleMapLocation | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const location = value as Partial<GoogleMapLocation>;

    if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return null;
    }

    return {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }
}
