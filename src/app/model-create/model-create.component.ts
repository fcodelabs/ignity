import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FieldComponent } from './field/field.component';
// import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MapComponent } from './map/map.component';
import { OptionSelectionComponent } from './option-selection/option-selection.component';
import {FireConnectionService} from '../shared/fire-connection.service';
import {DatabaseComponent} from './database/database.component';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.css']
})
export class ModelCreateComponent implements OnInit {
  modelName = '';
  result;
  field = '';
  dataType = '';
  fields = [];
  dataTypes = {};
  allData = [];
  mapFields = [];
  fs;
  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              // private firestore: AngularFirestore,
              private router: Router,
              private fire: FireConnectionService) {
    if (Object.keys(this.fire.fireObj).length === 0) {
      const data = JSON.parse(localStorage.getItem('firebaseData'));
      this.fire.setFireObj(data);
      console.log('in');
    }
    this.fs = fire.fs;
    const modelName = this.route.snapshot.paramMap.get('modelName');
    this.modelName = modelName;
    console.log(this.modelName);

    const cityRef = this.fs.collection('appData').doc(modelName);
    cityRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        this.fields = doc.data().fields;
        this.dataTypes = doc.data().datatypes;
        this.allData.push(doc.data());
      }
    })
      .catch(err => {
        console.log('Error getting document', err);
      });

  }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FieldComponent, {
      width: '350px',
      data: {field: this.field, dataType: this.dataType}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result == null);
      if (!(result == null)) {
        console.log(result.field);
        console.log(result.dataType);
        this.fields.push(result.field);
        // let en={};
        // en[result.field]=result.dataType;
        this.dataTypes[result.field] = result.dataType;
        const cityRef = this.fs.collection('appData').doc(this.modelName);

        if (result.dataType === 'array') {
          const data = {};
          data[result.field] = 'string';
          this.allData[0][result.field] = 'string';
          cityRef.update(data);
        }
        if (result.dataType === 'map') {
          this.allData[0][result.field] = [];
          this.openDialogMap(result.field);
        }
        if (result.dataType === 'optionselection') {
          this.allData[0][result.field] = [];
          this.openDialogOptionSelection(result.field);
        }
        if (result.dataType === 'database') {
          this.allData[0][result.field] = '';
          this.openDialogDatabase(result.field);
        }

        cityRef.update({fields: this.fields});
        cityRef.update({datatypes: this.dataTypes});

      }
    });
  }

  onViewData() {
    return this.router.navigate(['/model/data', this.modelName]);
  }

  onBack() {
    return this.router.navigate(['/models']);
  }

  updateValue(event, f) {
    console.log(event.target.value);
    const cityRef = this.fs.collection('appData').doc(this.modelName);
    console.log(this.allData[0][f]);
    const data = {};
    data[f] = event.target.value;
    cityRef.update(data);
  }

  openDialogMap(f): void {
    let mapFields = [];
    if (this.allData[0][f].length === 0) {
      mapFields = [{value: ''}];
    } else {
      for (const x of this.allData[0][f]) {
        const d = {
          value: 0,
        };
        d.value = x;
        mapFields.push(d);
      }
    }


    const dialogRef = this.dialog.open(MapComponent, {
      width: '350px',
      data: {fields: mapFields}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result == null);
      const flds = [];
      if (!(result == null)) {
        console.log(result.fields);
        for (const x of result.fields) {
          if (x.value !== '') {
            flds.push(x.value);
          }
        }
      } else {
        return;
      }
      const data = {};
      this.allData[0][f] = flds;
      data[f] = flds;
      const cityRef = this.fs.collection('appData').doc(this.modelName);
      cityRef.update(data);
    });
  }

  openDialogOptionSelection(f) {
    let options = [];
    if (this.allData[0][f].length === 0) {
      options = [{value: ''}];
    } else {
      for (const x of this.allData[0][f]) {
        const d = {
          value: 0,
        };
        d.value = x;
        options.push(d);
      }
    }

    const dialogRef = this.dialog.open(OptionSelectionComponent, {
      width: '350px',
      data: {options}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result == null);
      const ops = [];
      if (!(result == null)) {
        console.log(result.options);
        for (const x of result.options) {
          if (x.value !== '') {
            ops.push(x.value);
          }
        }
      } else {
        return;
      }
      const data = {};
      this.allData[0][f] = ops;
      data[f] = ops;
      const cityRef = this.fs.collection('appData').doc(this.modelName);
      cityRef.update(data);
    });
  }

  openDialogDatabase(f): void {
    const refCollection = this.allData[0][f];
    const dialogRef = this.dialog.open(DatabaseComponent, {
      width: '250px',
      data: {col: refCollection}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result);
      const data = {};
      this.allData[0][f] = result;
      data[f] = result;
      const cityRef = this.fs.collection('appData').doc(this.modelName);
      cityRef.update(data);
    });
  }

}
