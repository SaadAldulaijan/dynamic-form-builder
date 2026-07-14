import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicForm } from '../../../features/dynamic-form/components/dynamic-form/dynamic-form';

@Component({
  selector: 'app-home',
  imports: [DynamicForm],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home  implements OnInit {


  schemas = ['newTakhseesForm', 'takhseesForm', 'arrayForm', 'formGroupForm', 'testForm'];

  ngOnInit(): void {
    
  }

}
