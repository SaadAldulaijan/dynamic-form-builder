import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicForm } from "./features/dynamic-form/components/dynamic-form/dynamic-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dynamic-form-builder');
}
