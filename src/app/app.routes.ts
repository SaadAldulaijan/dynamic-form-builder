import { Routes } from '@angular/router';
import { DynamicForm } from './features/dynamic-form/components/dynamic-form/dynamic-form';
import { Home } from './pages/components/home/home';
import { FormDesigner } from './features/dynamic-form-designer/components/form-designer/form-designer';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'form/:key',
        component: DynamicForm,
    },
    {
        path: 'form-designer',
        component: FormDesigner,
    }
];
