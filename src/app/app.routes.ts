import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
    },
    {
        path: 'panel',
        loadChildren: () =>
            import("./protected/protected.routes")
                .then(m => m.routes)
    },
    {
        path: 'auth',
        loadChildren: () =>
            import("./auth/auth.routes")
                .then(m => m.routes)
    }
];
