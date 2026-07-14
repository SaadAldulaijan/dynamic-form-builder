import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);


  changeLanguage(lang: 'en' | 'ar'): void {
    this.translate.use(lang);
  }
}
