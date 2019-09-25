import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelCreateComponent } from './model-create/model-create.component';
import { ModelsComponent } from './models/models.component';
import { DataComponent } from './data/data.component';
import {FireLoginComponent} from './fire-login/fire-login.component';

const routes: Routes = [
  {path: '', component: FireLoginComponent},
  {path: 'models', component: ModelsComponent},
  {path: 'model-create/:modelName', component: ModelCreateComponent},
  {path: 'models/data/:docId/:colPath', component: DataComponent, data: []},
  {path: 'models/data/:superColName', component: ModelsComponent},
  {path: 'models/data/:superColName/:superColPath/subCollections', component: ModelsComponent},
  {path: 'models/data/:superColName/:docId/models', component: ModelsComponent},
  {path: 'model-create/:superColName/:docId/:modelName/:colPath', component: ModelCreateComponent},
  {path: 'models/data/:docId/:subColId/:colPath/:superColName/:selectedId', component: DataComponent, data: []},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
