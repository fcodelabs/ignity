import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import { FireConnectionService } from '../shared/fire-connection.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResizeEvent } from 'angular-resizable-element';
import { SelectArrayDatatypeComponent } from './select-array-datatype/select-array-datatype.component';
import {MapComponent} from '../model-create/map/map.component';
import {OptionSelectionComponent} from '../model-create/option-selection/option-selection.component';
import * as firebase from 'firebase';
import {DatabasePathComponent} from './database-path/database-path.component';
import {DocumentIDComponent} from './document-id/document-id.component';
import {Location} from '@angular/common';
import * as $ from 'jquery';

// import { async } from '@angular/core/testing';
// import { deflateRawSync } from 'zlib';
// import { delay } from 'q';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  defaultDataTypes = [
    {value: 'string', viewValue: 'String'},
    {value: 'number', viewValue: 'Number'},
    {value: 'boolean', viewValue: 'Check Box'},
    {value: 'map', viewValue: 'Map'},
    {value: 'array', viewValue: 'Array'},
    {value: 'datetime', viewValue: 'Date Time'},
    {value: 'geopoint', viewValue: 'Geo Point'},
    {value: 'database', viewValue: 'Data Base'},
    {value: 'optionselection', viewValue: 'Option Selection'},
  ];
  dataType = '';
  editField = '';
  docId = ''; // document name of the document which is containing all the model data about this model in metadata collection
  colId = ''; // path name of this collection
  collection = [];
  dataFields = [];
  collectionData = [];
  allData = [];
  dataTypes = {};
  tableData;
  newField = null;
  arrayDataType = 'string';
  fs;
  collectionDocs = {};
  superColId; // Id of th document which is containing sub collections
  fireObj;
  path;
  colPath;
  newDocId = '';
  superColName;
  selectedDoc;
  // fireCon;
  start;
  pressed;
  startX;
  startWidth;
  val = new Date(2018, 3, 10, 10, 30, 30);
  constructor(// private firestore: AngularFirestore,
              private route: ActivatedRoute,
              private dataS: DataService,
              private fire: FireConnectionService,
              private router: Router,
              public dialog: MatDialog,
              private location: Location,
              public renderer: Renderer) {
    if (Object.keys(this.fire.fireObj).length === 0) {
      const data = JSON.parse(localStorage.getItem('firebaseData'));
      this.fire.setFireObj(data);
      console.log('in');
    }
    this.fs = fire.fs;
    const id = this.route.snapshot.paramMap.get('docId');
    console.log('metadata docid =>', id);
    this.docId = id;
    this.colPath = this.route.snapshot.paramMap.get('colPath');
    console.log('colpath =>', this.colPath);
    this.superColId = this.route.snapshot.paramMap.get('subColId');
    console.log('subColId =>', this.superColId);
    this.superColName = this.route.snapshot.paramMap.get('superColName');
    console.log('superColName =>', this.superColName);
    this.selectedDoc = this.route.snapshot.paramMap.get('selectedId');
    console.log('selectedDoc =>', this.selectedDoc);
    let cityRef;
    if (this.superColId == null) {
      cityRef = this.fs.collection('metadata').doc(this.docId);
      this.path = '';
    } else {
      if (Object.keys(this.fire.metadataDocPath).length === 0) {
        this.fire.metadataDocPath = JSON.parse(localStorage.getItem('metadataDocPath'));
        this.fire.collectionPath = JSON.parse(localStorage.getItem('collectionPath'));
        this.fire.fireConStr = JSON.parse(localStorage.getItem('fireConStr'));
        console.log(this.fire.metadataDocPath);
      }
      if (Object.keys(this.fire.path).length === 0) {
        this.fire.path = JSON.parse(localStorage.getItem('path'));
      }
      console.log(id);
      // this.path = this.fire.getPath(this.subColId);
      // this.path = this.path + '/' + this.colPath;
      cityRef = this.fire.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.docId);
      this.fs = this.fs.doc(this.fire.collectionPath[this.superColName] + '/' + this.selectedDoc);
      console.log('100');
    }
    // this.fireCon = this.fs.collection(this.docId);
    cityRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          console.log(doc.data().fields);
          this.collection.push(doc.data().fields);
          this.colId = doc.data().path;
          this.dataTypes = doc.data().datatypes;
          this.tableData = doc.data();
          if (this.superColId == null) {
            this.path = this.colId;
          } else {
            this.path = this.fire.collectionPath[this.superColName];
            this.path = this.path + '/' + this.selectedDoc + '/' + this.colId;
          }
          // check data type and if data type == database load all the doc of collection
          // tslint:disable-next-line:forin
          for (const x in this.dataTypes) {
            if (this.dataTypes[x] === 'database') {
              const docs = [];
              console.log(this.tableData[x]);
              this.fs.collection(this.tableData[x]).get()
                .then(snapshot => {
                  snapshot.forEach(document => {
                    console.log(document.id);
                    docs.push(this.tableData[x] + '/' + document.id);
                  });
                });
              this.collectionDocs[x] = docs;
            }
            if (this.dataTypes[x] === 'array') {
              if (this.tableData[x] === 'database') {
                const docs = [];
                console.log(this.tableData[x + 'Ref']);
                this.fire.fs.collection(this.tableData[x + 'Ref']).get()
                  .then(snapshot => {
                    snapshot.forEach(document => {
                      console.log(document.id);
                      docs.push(this.tableData[x + 'Ref'] + '/' + document.id);
                    });
                  });
                this.collectionDocs[x] = docs;
              }
            }
          }
          console.log(this.collectionDocs);
          console.log('fire lst1');
          const citiesRef = this.fs.collection(doc.data().path);
          const allCities = citiesRef.get()
          .then(snapshot => {
            snapshot.forEach(document => {
              let bool = true;
              const localData = document.data();
              // check all the fields are in the docs
              const Ref = this.fs.collection(this.colId).doc(document.id);
              const data = {};
              for (const x of this.tableData.fields) {
                if (this.dataTypes[x] === 'datetime') {
                  console.log(localData[x].seconds);
                  localData[x] = new Date(localData[x].seconds * 1000);
                }
                if (document.data()[x] == null) {
                  console.log('error');
                  switch (this.dataTypes[x]) {
                    case 'string': {
                      data[x] = '';
                      localData[x] = '';
                      console.log('string');
                      break;
                    }
                    case 'number': {
                      data[x] = 0;
                      localData[x] = 0;
                      console.log('number');
                      break;
                    }
                    case 'boolean': {
                      data[x] = false;
                      localData[x] = false;
                      console.log('boolean');
                      break;
                    }
                    case 'map': {
                      const d = {};
                      for (const f of this.tableData[x]) {
                        d[f] = '';
                      }
                      data[x] = d;
                      localData[x] = d;
                      console.log('map');
                      break;
                    }
                    case 'array': {
                      data[x] = [];
                      localData[x] = [];
                      console.log('array');
                      break;
                    }
                    case 'datetime': {
                      data[x] = new Date();
                      localData[x] = new Date();
                      console.log('datetime');
                      break;
                    }
                    case 'geopoint': {
                      /* const gp = {
                        longitude: 0,
                        latitude: 0,
                      };*/
                      data[x] = new firebase.firestore.GeoPoint(0, 0);
                      localData[x] = new firebase.firestore.GeoPoint(0, 0);
                      console.log('geopoint');
                      break;
                    }
                    case 'database': {
                      data[x] = '';
                      localData[x] = '';
                      console.log('database');
                      break;
                    }
                    case 'optionselection': {
                      data[x] = this.tableData[x][0];
                      localData[x] = this.tableData[x][0];
                      console.log('optionselection');
                      break;
                    }
                    default: {
                      data[x] = '';
                      localData[x] = '';
                      console.log('error[default]');
                      break;
                    }
                  }
                  bool = false;
                } else {
                  switch (this.dataTypes[x]) {
                    case 'array': {
                      console.log('array value type');
                      console.log(typeof document.data()[x]);
                      /* switch (document.data()[x]) {
                        case 'string': {

                        }
                      } */
                      break;
                    }
                    default: {
                      console.log(typeof document.data()[x]);
                      break;
                    }
                  }
                  console.log('ok');
                }
              }
              Ref.update(data);
              console.log(document.id, '=>', document.data());
              this.collectionData.push(document);
              this.allData.push([document.id, localData]);
              // console.log(this.collectionData[0].data().field3);
            });
          }
        , err => {
            console.log('Error getting documents', err);
        });

        }
      }
      , err => {
        console.log('Error getting document', err);
      });

    }

  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
  }


    /*
    this.collection= this.fire.getModel(this.docId);
    this.setValues();
    this.collectionData=this.fire.getData(this.collectionData);*/




    /*let cityRef = this.firestore.collection('metadata').doc(this.docId);
    let getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          this.collection.push(doc);
          this.dataFields=doc.data().fields;
          this.collectionID=doc.data().path;
          console.log(doc.data().path);
        }
      })
      err => {
        console.log('Error getting document', err);
      };

      let citiesRef = this.firestore.collection(this.collectionID);
      let allCities = citiesRef.get()
      .subscribe(snapshot => {
        snapshot.forEach(doc => {
          this.collectionData.push(doc);
          console.log(doc.id, '=>', doc.data());
        });
      })
    err => {
        console.log('Error getting documents', err);
    };*/


  /*async setValues(){
    await delay(8000);
    let col=await this.collection;
    this.dataFields= col[0].data().fields;
    this.collectionID= col[0].data().path;
  }
  async setData(){
    await delay(7000);
    let data=await this.collectionData;
    console.log(data);
    this.allData=data;
  }

  getCollectionData(docId) {
    return this.firestore.collection(docId).snapshotChanges();
  }*/
/*onClick(cell){
  console.log(cell);
}*/

  ngOnInit() {
  }
  dataf() {
    console.log(this.dataFields);
  }


  changeValue(event, row, col) {
    this.editField = event.target.textContent;
    if (this.editField !== undefined) {
      if (this.dataTypes[col] === 'number') {
      }
    }
  }

  checkNumber(val) {
    const newregex = /^[-+]?[0-9]*\.?[0-9]+$/;
    if (newregex.test(val)) {
      return true;
    } else {
      return false;
    }
  }
  updateValueG(event, row, col, p) {
    const cityRef = this.fs.collection(this.colId).doc(row[0]);
    const data = {};
    const point = {
      latitude: 0,
      longitude: 0,
    };
    if (p === 'lon') {
      point.longitude = +event.target.value;
      point.latitude = row[1][col].latitude;
      /*for (let doc of this.collectionData){
        if(doc.id==row[0]){
          id =this.collectionData.indexOf(doc);
        }
      }*/
      // console.log(this.collectionData[id].data());
      // row[1][col].longitude = +event.target.value;
    } else {
      point.latitude = +event.target.value;
      point.longitude = row[1][col].longitude;
      /*for (let doc of this.collectionData){
        if(doc.id==row[0]){
          id =this.collectionData.indexOf(doc);
        }
      }*/
      // row[1][col].latitude = +event.target.value;
    }

    data[col] = new firebase.firestore.GeoPoint(point.latitude, point.longitude);
    cityRef.update(data);

  }

  addArrayValue(row, col) {
    console.log('fine');
    if (this.tableData[col] === 'string') {
      row[1][col].push('');
    }
    if (this.tableData[col] === 'number') {
      row[1][col].push(0);
    }
    if (this.tableData[col] === 'boolean') {
      row[1][col].push(false);
    }
    if (this.tableData[col] === 'database') {
      row[1][col].push('');
    }
    const cityRef = this.fs.collection(this.colId).doc(row[0]);
    const data = {};
    data[col] = row[1][col];
    cityRef.update(data);
  }

  updateDatabaseRef(event, row, col) {
    console.log(row[1][col]);
    // console.log(row[1][col].path);
    const connection = this.fs.collection(this.colId).doc(row[0]);
    const data = {};
    console.log(event);
    row[1][col] = this.fs.doc(event);
    data[col] = this.fs.doc(event);
    connection.update(data);
  }

  deleteArrayItem(row, col, i) {
    console.log(i);
    row[1][col].splice(i, 1);
    console.log('delete');
    const connection = this.fs.collection(this.colId).doc(row[0]);
    const data = {};
    data[col] = row[1][col];
    connection.update(data);
  }

  updateValueArray(event, row, col, i) {
    let lst;
    const con = this.fs.collection(this.colId).doc(row[0]);
    con.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          lst = doc.data().col;
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    // row[1][col][i]=event.target.value;
    if (this.tableData[col] === 'string') {
      console.log(event.target.value);
      row[1][col].splice(i, 1);
      row[1][col].splice(i, 0, event.target.value.trim() );
    }
    if (this.tableData[col] === 'number') {
      console.log(event.target.value);
      // lst = row[1][col].slice();
      lst.splice(i, 1);
      lst.splice(i, 0, +event.target.value );
      // row[1][col][i] = +event.target.value;
      console.log('lst', lst);
      console.log(row[1][col]);
    }
    if (this.tableData[col] === 'boolean') {
      console.log('true' === event.target.value);
      // row[1][col][i]=!row[1][col][i];
      row[1][col].splice(i, 1);
      row[1][col].splice(i, 0, 'true' === event.target.value);
    }
    if (this.tableData[col] === 'database') {
      row[1][col].splice(i, 1);
      row[1][col].splice(i, 0, this.fire.fs.doc(event.value) );
      console.log(row[1][col][i].path);
    }
    const cityRef = this.fs.collection(this.colId).doc(row[0]);
    const data = {};
    data[col] = lst;
    cityRef.update(data);

    console.log(row[1][col]);
  }
  test(event, row, col, i) {
    console.log(row[1][col]);
    console.log(event.target.value);
    console.log(row[1][col][i]);
  }

  updateValue(event, row, col) {
    const cityRef = this.fs.collection(this.colId).doc(row[0]);
    const data = {};
    if (this.dataTypes[col] === 'boolean') {
      console.log(event.target.textContent);
      return;
    }
    if (this.dataTypes[col] === 'number') {
      console.log('in');
      console.log(+event.target.value);
      console.log(row[1][col]);
      data[col] = +event.target.value;
      if (isNaN(+event.target.value)) {
        return;
      }
      cityRef.update(data);
      return;
    }
    if (this.dataTypes[col] === 'geopoint') {
      console.log(+event.target.value);
      return;
    }
    if (this.dataTypes[col] === 'map') {
      console.log(event.target.textContent);
      console.log(row[1][col]);
      data[col] = row[1][col];
      cityRef.update(data);
      return;
    }
    if (this.dataTypes[col] === 'array') {
      console.log(row[1][col]);
      return;
    }
    if (this.dataTypes[col] === 'optionselection') {
      console.log(row[1][col]);
      data[col] = row[1][col];
      cityRef.update(data);
      return;
    }
    if (this.dataTypes[col] === 'datetime') {
      console.log(event.target.value);
      row[1][col] = new Date(event.target.value);
      console.log(row[1][col]);
      data[col] = new Date(event.target.value);
      cityRef.update(data);
      return;
    }
    console.log(row[0]);
    console.log(col);
    console.log(event.target.textContent.trim());
    data[col] = event.target.textContent.trim();
    cityRef.update(data);
  }

  add() {
    this.openDialogDocId();
  }

  remove(rowID) {
    if (confirm('Delete "' + rowID + '" and all its descendant properties?')) {
      console.log('ok');
      console.log(rowID);
      for (const entry of this.collectionData) {
        if (entry.id === rowID) {
          const id = this.collectionData.indexOf(entry);
          this.fs.collection(this.colId).doc(rowID).delete();
          this.collectionData.splice(id, 1);
          this.allData.splice(id, 1);
          break;
        }
      }
    } else {
      console.log('cancel');
    }
  }

  getValue(row, col) {
    return row.data()[col];
  }

  onHome() {
    return this.router.navigate(['/models']);
  }

  onBack() {
    this.location.back();
  }

  updateCheckBox(row, col) {
    console.log(!row[1][col]);
    const cityRef = this.fs.collection(this.colId).doc(row[0]);
    const data = {};
    console.log(row[0]);
    console.log(col);
    data[col] = !row[1][col];
    cityRef.update(data);

  }

  updateDataType(eventVal, col) {
    let connection;
    if (this.superColId == null) {
      connection = this.fs.collection('metadata').doc(this.docId);
    } else {
      connection = this.fire.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.docId);
    }
    console.log(eventVal);
    console.log(this.dataTypes[col]);
    switch (this.dataTypes[col]) {
      case 'string': {
        const upData = {};
        console.log('string');
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = '';
          upData[col] = '';
          con.update(upData);
        }
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        break;
      }
      case 'number': {
        const upData = {};
        console.log('number');
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = 0;
          upData[col] = 0;
          con.update(upData);
        }
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        break;
      }
      case 'boolean': {
        const upData = {};
        console.log('boolean');
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = false;
          upData[col] = false;
          con.update(upData);
        }
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        break;
      }
      case 'map': {
        console.log('map');
        this.tableData[col] = [];
        this.openDialogMap(col);
        for (const i of this.allData) {
          i[1][col] = {};
        }
        /* for (const f of this.tableData[entry]) {
          d[f] = '';
        } */
        break;
      }
      case 'array': {
        const upData = {};
        console.log('array');
        console.log('selesct data type');
        this.openDialogArray(eventVal, col);
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = [];
          upData[col] = [];
          con.update(upData);
        }
        break;
      }
      case 'datetime': {
        const upData = {};
        console.log('datetime');
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = new Date();
          upData[col] = new Date();
          con.update(upData);
        }
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        break;
      }
      case 'geopoint': {
        const upData = {};
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = new firebase.firestore.GeoPoint(0, 0);
          upData[col] = new firebase.firestore.GeoPoint(0, 0);
          con.update(upData);
        }
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        console.log('geopoint');
        break;
      }
      case 'database': {
        const upData = {};
        console.log('database');
        this.openDialogDatabase(col);
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = '';
          upData[col] = '';
          con.update(upData);
        }
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        break;
      }
      case 'optionselection': {
        this.tableData[col] = [];
        this.openDialogOptionSelection(col);
        console.log('optionselection');
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        break;
      }
      default: {
        const upData = {};
        for (const i of this.allData) {
          const con = this.fs.collection(this.colId).doc(i[0]);
          i[1][col] = '';
          upData[col] = '';
          con.update(upData);
        }
        console.log('error[default]');
        const data = {
          datatypes: this.dataTypes,
        };
        connection.update(data);
        break;
      }
    }

   /* const data = {
      datatypes: this.dataTypes,
    };
    connection.update(data); */

  }

  addField(event) {
    // event use to get new field name,newField global variable is only using to clear input box
    let newField = '';
    let connection;
    if (this.superColId == null) {
      connection = this.fs.collection('metadata').doc(this.docId);
    } else {
      connection = this.fire.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.docId);
    }
    console.log(event.target.value);
    // remove all the whitespaces of input
    newField = event.target.value.trim();
    if (newField === '') {
      console.log('true');
    } else {
      if (this.collection[0].includes(newField)) {
        console.log('already exist field');
        alert('field "' + newField + '" is already existing. Use different name for new field');
      } else {
        this.collection[0].push(newField);
        console.log(this.collection[0]);
        // make default datatype of new field as 'string'
        this.dataTypes[newField] = 'string';
        console.log(this.dataTypes);
        // update firestore
        const data = {
          fields : this.collection[0],
          datatypes : this.dataTypes
        };
        connection.update(data);
      }
    }
    this.newField = null;
  }
// select data type of array
  openDialogArray(eventVal, col): void {
    let connection;
    if (this.superColId == null) {
      connection = this.fs.collection('metadata').doc(this.docId);
    } else {
      connection = this.fire.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.docId);
    }
    const dialogRef = this.dialog.open(SelectArrayDatatypeComponent, {
      width: '250px',
      data: {arrayDataType: this.arrayDataType}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.arrayDataType = result;
      const data = {
        datatypes: this.dataTypes,
      };
      this.tableData[col] = this.arrayDataType;
      if ( result === 'database') {
        this.openDialogDatabase(col);
      }
      data[col] = this.arrayDataType;
      connection.update(data);
      this.arrayDataType = 'string';
    });
  }

  openDialogMap(f): void {
    const mapFields = [{value: ''}];

    const dialogRef = this.dialog.open(MapComponent, {
      width: '350px',
      data: {fields: mapFields}
    });
    let connection;
    if (this.superColId == null) {
      connection = this.fs.collection('metadata').doc(this.docId);
    } else {
      connection = this.fire.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.docId);
    }
    dialogRef.afterClosed().subscribe(result => {
      // this.result = result;
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
      const data = {
        datatypes: this.dataTypes,
      };
      this.tableData[f] = flds;
      const upData = {};
      for (const i of this.allData) {
        const con = this.fs.collection(this.colId).doc(i[0]);
        const d = {};
        for (const j of this.tableData[f]) {
          d[j] = '';
        }
        i[1][f] = d;
        upData[f] = d;
        con.update(upData);
      }
      data[f] = flds;
      connection.update(data);
    });
  }

  openDialogOptionSelection(f) {
    const options = [{value: ''}];
    let connection;
    if (this.superColId == null) {
      connection = this.fs.collection('metadata').doc(this.docId);
    } else {
      connection = this.fire.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.docId);
    }
    const dialogRef = this.dialog.open(OptionSelectionComponent, {
      width: '350px',
      data: {options}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.result = result;
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
      const upData = {};
      this.tableData[f] = ops;
      for (const i of this.allData) {
        const con = this.fs.collection(this.colId).doc(i[0]);
        i[1][f] = ops[0];
        upData[f] = ops[0];
        con.update(upData);
      }
      const data = {};
      data[f] = ops;
      connection.update(data);
    });
  }

  openDialogDatabase(f): void {
    const refCollection = '';
    console.log(this.tableData[f]);
    const dialogRef = this.dialog.open(DatabasePathComponent, {
      width: '300px',
      data: {col: refCollection}
    });

    dialogRef.afterClosed().subscribe(result => {
      const ref = result.trim();
      console.log('The dialog was closed');
      console.log(result.trim());
      const data = {};
      const docs = [];
      this.fire.fs.collection(ref).get()
        .then(snapshot => {
          snapshot.forEach(document => {
            console.log(document.id);
            docs.push(ref + '/' + document.id);
          });
        });
      this.collectionDocs[f] = docs;
      let cityRef;
      if (this.superColId == null) {
        cityRef = this.fs.collection('metadata').doc(this.docId);
      } else {
        cityRef = this.fire.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.docId);
      }
      if (this.tableData[f] === 'database') {
        console.log('success');
        data[f + 'Ref'] = ref;
      } else {
        this.tableData[f] = ref;
        data[f] = ref;
      }
      cityRef.update(data);
    });
  }

  onViewSubCollections(rowID) {
    console.log(rowID);
    if (this.superColId == null) {
      const path = this.colId + '/' + rowID;
      this.fire.setPath(rowID, path);
      this.fire.fireConStr[rowID] = [];
      this.fire.fireConStr[rowID].push(this.colId);
      this.fire.fireConStr[rowID].push(rowID);
      this.fire.superColPath[rowID] = [];
      this.fire.superColPath[rowID].push(this.colId);
      this.fire.subColMetadata[rowID] = 'metadata' + '/' + this.docId ;
    } else {
      let path = this.fire.getPath(this.superColId);
      path = path + '/' + this.colPath + '/' + rowID;
      this.fire.setPath(rowID, path);
      this.fire.fireConStr[rowID] = this.fire.fireConStr[this.superColId];
      this.fire.fireConStr[rowID].push(this.colId);
      this.fire.fireConStr[rowID].push(rowID);
      this.fire.superColPath[rowID].push(this.colId);
      this.fire.subColMetadata[rowID] = this.fire.subColMetadata[this.superColId] + '/subCollections' + '/' + this.docId ;
    }
    const fireCon = this.fs.collection(this.colId).doc(rowID);
    this.fire.setConnection(rowID, fireCon);
    localStorage.setItem('fireConStr', JSON.stringify(this.fire.fireConStr));
    localStorage.setItem('subColMetadata' , JSON.stringify(this.fire.subColMetadata));
    localStorage.setItem('superColPath', JSON.stringify(this.fire.superColPath));
    return this.router.navigate(['/models/data', this.docId, rowID, 'models']);
  }

  onSubCollections() {
    console.log('sub-collections');
    if (this.superColId == null) {
      this.fire.metadataDocPath[this.docId] = this.docId;
      this.fire.collectionPath[this.docId] = this.colPath;
      this.fire.path[this.docId] = this.colPath;
      this.fire.fireConStr[this.docId] = [this.colPath];
    } else {
      this.fire.metadataDocPath[this.docId] = this.fire.metadataDocPath[this.superColName] + '/subCollections/' + this.docId;
      this.fire.collectionPath[this.docId] = this.fire.collectionPath[this.superColName] + '/' + this.selectedDoc + '/' + this.colId;
      this.fire.path[this.docId] = this.fire.path[this.superColName] + '/' + this.selectedDoc + '/' + this.colId;
    }
    localStorage.setItem('metadataDocPath', JSON.stringify(this.fire.metadataDocPath));
    localStorage.setItem('collectionPath', JSON.stringify(this.fire.collectionPath));
    localStorage.setItem('path', JSON.stringify(this.fire.path));
    localStorage.setItem('fireConStr', JSON.stringify(this.fire.fireConStr));
    return this.router.navigate(['/models/data', this.docId, this.colPath, 'subCollections']);
  }

  secondsToDate(secs) {
    // console.log(secs === undefined);
    if (secs === undefined) {
      return;
    }
    const date = new Date(secs * 1000);
    // const dateISO = date.toISOString().split(':');
    // console.log(dateISO[0] + ':' + dateISO[1]);
    return date;
  }
  saveDate(row, col) {
    const date = new Date(row[1][col].seconds * 1000);
    row[1][col] = date;
    // console.log(date);
  }

  openDialogDocId(): void {
    let newDocId = '';
    const dialogRef = this.dialog.open(DocumentIDComponent, {
      width: '300px',
      data: {id: newDocId}
    });

    dialogRef.afterClosed().subscribe(result => {
      let newAddDoc = '';
      const fields = this.collection[0];
      const dt = {};
      for (const entry of fields) {
        switch (this.dataTypes[entry]) {
          case 'string': {
            dt[entry] = '';
            console.log('string');
            break;
          }
          case 'number': {
            dt[entry] = 0;
            console.log('number');
            break;
          }
          case 'boolean': {
            dt[entry] = false;
            console.log('boolean');
            break;
          }
          case 'map': {
            const d = {};
            for (const f of this.tableData[entry]) {
              d[f] = '';
            }
            dt[entry] = d;
            console.log('map');
            break;
          }
          case 'array': {
            dt[entry] = [];
            console.log('array');
            break;
          }
          case 'datetime': {
            dt[entry] = new Date();
            console.log('datetime');
            break;
          }
          case 'geopoint': {
            /* const gp = {
              longitude: 0,
              latitude: 0,
            };*/
            dt[entry] = new firebase.firestore.GeoPoint(0, 0);
            console.log('geopoint');
            break;
          }
          case 'database': {
            dt[entry] = '';
            console.log('database');
            break;
          }
          case 'optionselection': {
            dt[entry] = this.tableData[entry][0];
            console.log('optionselection');
            break;
          }
          default: {
            dt[entry] = '';
            console.log('error[default]');
            break;
          }
        }
      }
      console.log('The dialog was closed');
      console.log(newDocId);
      if (result !== undefined) {
        newDocId = result.trim();
      } else {
        return;
      }
      if (newDocId === '') {
        const addDoc = this.fs.collection(this.colId).add(
          dt
        ).then(ref => {
          console.log('Added document with ID: ', ref.id);
          newAddDoc = ref.id;
          // this.collectionData.push(addDoc);
          const cityRef = this.fs.collection(this.colId).doc(newAddDoc);
          const getDoc = cityRef.get()
            .then(doc => {
              if (!doc.exists) {
                console.log('No such document!');
              } else {
                console.log('Document data:', doc.data());
                this.collectionData.push(doc);
                this.allData.push([doc.id, doc.data()]);
              }
            });
        });
      } else {
        this.fs.collection(this.colId).doc(newDocId).set(dt)
          .then(success => {
            console.log('Document successfully written!');
            this.allData.push([newDocId, dt]);
            this.fs.collection(this.colId).doc(newDocId).get().then(
              doc => {
                if (!doc.exists) {
                  console.log('No such document!');
                } else {
                  this.collectionData.push(doc);
                  console.log(doc);
                }
              }
            );
          })
          // tslint:disable-next-line:only-arrow-functions
          .catch(function(error) {
            console.error('Error writing document: ', error);
          });
      }
    });
  }
  // resize column length
  onMouseDown(event) {
    this.start = event.target;
    this.pressed = true;
    this.startX = event.x;
    this.startWidth = $(this.start).parent().width();
    this.initResizableColumns();
  }

  initResizableColumns() {
    this.renderer.listenGlobal('body', 'mousemove', (event) => {
      if (this.pressed) {
        const width = this.startWidth + (event.x - this.startX);
        $(this.start).parent().css({'min-width': width, 'max-   width': width});
        const index = $(this.start).parent().index() + 1;
        $('.glowTableBody tr td:nth-child(' + index + ')').css({'min-width': width, 'max-width': width});
      }
    });
    this.renderer.listenGlobal('body', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
      }
    });
  }
}
