import { Routes } from '@angular/router';

export const routes: Routes = [
    // Redirige a perfumes ya que es el primer item del módulo de inventario
    // La redirección es solo para el desarrollo, como tal no debería realizar la redirección
    {
        path: '',
        loadComponent: () =>
            import("./perfumes/perfumes.component")
                .then(m => m.PerfumesComponent)
    },
    {
        path: 'agregar',
        loadComponent: () =>
            import("./form-perfume/form-perfume.component")
                .then(m => m.FormPerfumeComponent)
    },
    {
        path: 'editar/:id',
        loadComponent: () =>
            import("./form-perfume/form-perfume.component")
                .then(m => m.FormPerfumeComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
