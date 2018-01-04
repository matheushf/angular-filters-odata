import { SwitchComponent } from './components/filtros/switch/switch.component';
import { SwitchDropdownComponent } from './components/filtros/switch-dropdown/switch-dropdown.component';
import { PesquisavelComponent } from './components/filtros/pesquisavel/pesquisavel.component';
import { SelectComponent } from './components/filtros/select/select.component';
import { DataComponent } from './components/filtros/data/data.component';
import { FiltersComponent } from './components/filtros/filtros.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    SwitchComponent,
    SwitchDropdownComponent,
    PesquisavelComponent,
    SelectComponent,
    DataComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
