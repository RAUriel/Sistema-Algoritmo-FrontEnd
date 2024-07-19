import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MenuComponent } from './pages/menu/menu.component';
import { FormularioComponent } from './components/formulario/formulario/formulario.component';
import { Formulario2Component } from './components/formulario/formulario2/formulario2.component';
import { KmeansComponent } from './components/algoritmos/kmeans/kmeans.component';
import { KnnComponent } from './components/algoritmos/knn/knn.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HeaderComponent } from './pages/header/header.component';
import { DatosComponent } from './pages/datos/datos.component';
import { GeneralComponent } from './components/algoritmos/general/general.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    MenuComponent,
    FormularioComponent,
    Formulario2Component,
    KmeansComponent,
    KnnComponent,
    FooterComponent,
    HeaderComponent,
    DatosComponent,
    GeneralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
