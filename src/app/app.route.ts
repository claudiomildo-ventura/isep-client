import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'page-home',
        pathMatch: 'full'
    },
    {
        title: 'CV IT - isep',
        path: 'page-home',
        loadComponent: () =>
            import('./components/dashboard-view/page-home/page-home.component').then(m => m.PageHomeComponent)
    },
    {
        title: 'CV IT - structure',
        path: 'page-structure',
        loadComponent: () =>
            import('./components/structure-view/page-structure/page-structure.component').then(m => m.PageStructureComponent)
    },
    {
        title: 'CV IT - parameter',
        path: 'page-parameter',
        loadComponent: () =>
            import('./components/parameter-view/parameter-view.component').then(m => m.ParameterViewComponent)
    },
    {
        title: 'Error page',
        path: 'erro',
        loadChildren: () =>
            import('./core/error/error.route').then(m => m.ERROR_ROUTES)
    },
    {
        path: '**',
        redirectTo: 'erro'
    }
];