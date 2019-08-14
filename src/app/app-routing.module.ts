import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelCreateComponent } from './model-create/model-create.component'
import { ModelsComponent } from './models/models.component';
import { DataComponent } from './data/data.component';

const routes: Routes = [
  {path:'model-create/:modelName',component:ModelCreateComponent},
  {path:'',component:ModelsComponent},
  {path:'model/data/:docId',component:DataComponent,data:[]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
