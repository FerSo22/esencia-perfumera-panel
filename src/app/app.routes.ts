import { Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { protectedInterceptor } from './protected/shared/services/protected.interceptor';

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
                .then(m => m.routes),
        providers: [
            provideHttpClient(withInterceptors(
                [ protectedInterceptor ]
            ))
        ]
    },
    {
        path: 'auth',
        loadChildren: () =>
            import("./auth/auth.routes")
                .then(m => m.routes)
    }
];
