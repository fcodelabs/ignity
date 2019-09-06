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
  {path: 'model/data/:docId', component: DataComponent, data: []}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
