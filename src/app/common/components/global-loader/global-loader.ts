import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GlobalLoaderService } from '../../services/global-loader';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-loader.html',
  styleUrls: ['./global-loader.scss']
})
export class GlobalLoader {
  protected readonly loader = inject(GlobalLoaderService);
}