import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModelsComponent } from './models/models.component';
import { ModelComponent } from './models/model/model.component';
import { ModelCreateComponent } from './model-create/model-create.component';
import { DataComponent } from './data/data.component';
import { FieldComponent } from './model-create/field/field.component';
import { MapComponent } from './model-create/map/map.component';
import { OptionSelectionComponent } from './model-create/option-selection/option-selection.component';

const config = {
  apiKey: "AIzaSyDSrdbgebIsyvK4vXeM9JXKAAsY6c-xOqs",
  authDomain: "fir-cms-ae9d0.firebaseapp.com",
  databaseURL: "https://fir-cms-ae9d0.firebaseio.com",
  projectId: "fir-cms-ae9d0",
  storageBucket: "fir-cms-ae9d0.appspot.com",
  messagingSenderId: "814248522504",
  appId: "1:814248522504:web:dd849efcd11e5a0d"
}



@NgModule({
  declarations: [
    AppComponent,
    ModelsComponent,
    ModelComponent,
    ModelCreateComponent,
    DataComponent,
    FieldComponent,
    MapComponent,
    OptionSelectionComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule
  ],
  exports:[ModelComponent,FieldComponent,MapComponent,OptionSelectionComponent],
  entryComponents: [ModelComponent,FieldComponent,MapComponent,OptionSelectionComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
