import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './common/components/language-switcher/language-switcher';
import { Home } from './pages/components/home/home';
import { GlobalLoader } from './common/components/global-loader/global-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcher, Home, GlobalLoader],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('dynamic-form-builder');

}
