import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicForm } from "./features/dynamic-form/components/dynamic-form/dynamic-form";
import { LanguageSwitcher } from './common/components/language-switcher/language-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicForm, LanguageSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dynamic-form-builder');

}
