import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './components/formulario/formulario/formulario.component';
import { GeneralComponent } from './components/algoritmos/general/general.component';
import { KnnComponent } from './components/algoritmos/knn/knn.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { DatosComponent } from './pages/datos/datos.component';


const routes: Routes = [
  //Ruras Globales.
  { path: 'inicio', component: InicioComponent },
  //Rutas Personalizadas.
  { path: 'formulario', component: FormularioComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'datos', component: DatosComponent },
  { path: 'knn', component: KnnComponent },
  { path: '**', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
