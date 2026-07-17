import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './common/components/language-switcher/language-switcher';
import { GlobalLoader } from './common/components/global-loader/global-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcher,  GlobalLoader],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('dynamic-form-builder');

}
