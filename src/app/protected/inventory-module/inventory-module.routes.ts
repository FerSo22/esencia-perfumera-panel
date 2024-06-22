import { Routes } from '@angular/router';

export const routes: Routes = [
    // Redirige a perfumes ya que es el primer item del módulo de inventario
    // La redirección es solo para el desarrollo, como tal no debería realizar la redirección
    {
        path: '',
        redirectTo: 'perfumes',
        pathMatch: 'full'
    },
    {
        path: 'perfumes',
        loadChildren: () =>
            import("./pages/perfumes/perfumes.routes")
                .then(m => m.routes)
        // children: [
            // {
            //     path: 'perfumes',
            //     loadComponent: () =>
            //         import("./pages/perfumes/perfumes/perfumes.component")
            //             .then(m => m.PerfumesComponent)
            // },
            // {
            //     path: 'brands',
            //     loadComponent: () =>
            //         import("./pages/brands/brands.component")
            //             .then(m => m.BrandsComponent)
            // }
        // ]
    }
];
