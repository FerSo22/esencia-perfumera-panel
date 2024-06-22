import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    // Redirigie al módulo de inventario ya que es el único que hay por el momento, por lo que es el primero al cual redirigir
    {
        path: '',
        redirectTo: 'inventario',
        pathMatch: 'full'
    },
    {
        path: 'inventario',
        component: MainComponent,
        loadChildren: () =>
            import("./inventory-module/inventory-module.routes")
                .then(m => m.routes)
    }
];
