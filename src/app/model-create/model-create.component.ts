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
import * as firebase from 'firebase';

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
  fireObj;
  docId;
  path;
  colPath;
  superColName;
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
    const docId = this.route.snapshot.paramMap.get('docId');
    const colPath = this.route.snapshot.paramMap.get('colPath');
    this.superColName = this.route.snapshot.paramMap.get('superColName');
    this.colPath = colPath;
    this.docId = docId;
    let cityRef;
    if (docId == null ) {
      cityRef = this.fs.collection('metadata').doc(modelName);
    } else {
      if (Object.keys(this.fire.fireConStr).length === 0) {
        this.fire.metadataDocPath = JSON.parse(localStorage.getItem('metadataDocPath'));
        this.fire.collectionPath = JSON.parse(localStorage.getItem('collectionPath'));
      }
      console.log(this.superColName);
      if (Object.keys(this.fire.path).length === 0) {
        this.fire.path = JSON.parse(localStorage.getItem('path'));
      }
      console.log(docId);
      this.path = this.fire.path[this.superColName];
      cityRef = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(modelName);
    }
    this.modelName = modelName;
    console.log(this.modelName);
    console.log(docId);


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
        console.log(result.field.trim());
        console.log(result.dataType);
        this.fields.push(result.field.trim());
        // let en={};
        // en[result.field]=result.dataType;
        this.dataTypes[result.field] = result.dataType;
        let cityRef;
        if (this.docId == null) {
          cityRef = this.fs.collection('metadata').doc(this.modelName);
        } else {
          cityRef = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.modelName);
        }

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
    if (this.docId == null ) {
      return this.router.navigate(['/models/data', this.modelName]);
    } else {
      return this.router.navigate(['/models/data', this.modelName, this.docId, this.colPath, this.superColName]);
    }
  }

  onBack() {
    return this.router.navigate(['/models']);
  }

  onDeleteField(f) {
    console.log(f);
    console.log(this.allData[0].path);
    let connection;
    let connectionMD;
    const dataDel = {};
    dataDel[f] = firebase.firestore.FieldValue.delete();
    if (this.docId == null) {
      connection = this.fs.collection(this.allData[0].path);
      connectionMD = this.fs.collection('metadata').doc(this.modelName);

      connection.get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            connection.doc(doc.id).update(dataDel);
            console.log(doc.id, '=>', doc.data());
          });
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    } else {
      const paths = [];
      console.log(this.fire.collectionPath);
      connection = this.fs.collection(this.fire.collectionPath[this.superColName]);
      connection.get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            paths.push(doc.id);
          });
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
      console.log(paths);
      for (const docPath of paths) {
        console.log(docPath);
        connection = this.fs.collection(this.fire.collectionPath[this.superColName] + '/' + docPath + '/' + this.allData[0].path);
        connection.get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              connection.doc(doc.id).update(dataDel);
              console.log(doc.id, '=>', doc.data());
            });
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }

      connectionMD = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.modelName);
    }

    if (this.dataTypes[f] === 'array' || this.dataTypes[f] === 'map' || this.dataTypes[f] === 'database'
      || this.dataTypes[f] === 'optionselection') {
      if (this.dataTypes[f] === 'array' && this.allData[0][f] === 'database') {
        const dataDelArrayRef = {};
        dataDelArrayRef[f + 'Ref'] = firebase.firestore.FieldValue.delete();
        connectionMD.update(dataDelArrayRef);
        delete this.allData[0][f + 'Ref'];
      }
      const dataDelAMDO = {};
      dataDelAMDO[f] = firebase.firestore.FieldValue.delete();
      connectionMD.update(dataDelAMDO);
      delete this.allData[0][f];
    }
    const indexF = this.fields.indexOf(f);
    this.fields.splice(indexF);
    delete this.dataTypes[f];
    const upData = {
      datatypes : {},
      fields: []
    };
    upData.datatypes = this.dataTypes;
    upData.fields = this.fields;
    connectionMD.update(upData);
  }

  updateValue(event, f) {
    console.log(event.target.value);
    let cityRef;
    if (this.docId == null) {
      cityRef = this.fs.collection('metadata').doc(this.modelName);
    } else {
      cityRef = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.modelName);
    }
    console.log(this.allData[0][f]);
    if (event.target.value === 'database') {
      this.openDialogDatabase(f + 'Ref');
    }
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
            flds.push(x.value.trim());
          }
        }
      } else {
        return;
      }
      const data = {};
      this.allData[0][f] = flds;
      data[f] = flds;
      let cityRef;
      if (this.docId == null) {
        cityRef = this.fs.collection('metadata').doc(this.modelName);
      } else {
        cityRef = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.modelName);
      }
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
            ops.push(x.value.trim());
          }
        }
      } else {
        return;
      }
      const data = {};
      this.allData[0][f] = ops;
      data[f] = ops;
      let cityRef;
      if (this.docId == null) {
        cityRef = this.fs.collection('metadata').doc(this.modelName);
      } else {
        cityRef = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.modelName);
      }
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
      this.result = result.trim();
      console.log('The dialog was closed');
      console.log(result);
      const data = {};
      this.allData[0][f] = result;
      data[f] = result;
      let cityRef;
      if (this.docId == null) {
        cityRef = this.fs.collection('metadata').doc(this.modelName);
      } else {
        cityRef = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.modelName);
      }
      cityRef.update(data);
    });
  }

}
