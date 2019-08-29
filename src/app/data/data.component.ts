import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import { FireConnectionService } from '../shared/fire-connection.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SelectArrayDatatypeComponent } from './select-array-datatype/select-array-datatype.component';
import {MapComponent} from '../model-create/map/map.component';
import {OptionSelectionComponent} from '../model-create/option-selection/option-selection.component';
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
    {value: 'datatime', viewValue: 'Data Time'},
    {value: 'geopoint', viewValue: 'Geo Point'},
    {value: 'database', viewValue: 'Data Base'},
    {value: 'optionselection', viewValue: 'Option Selection'},
  ];
  dataType = '';
  editField = '';
  docId = '';
  colId = '';
  collection = [];
  dataFields = [];
  collectionData = [];
  allData = [];
  dataTypes = {};
  tableData;
  newField = null;
  arrayDataType = 'string';
  constructor(private firestore: AngularFirestore,
              private route: ActivatedRoute,
              private dataS: DataService,
              private fire: FireConnectionService,
              private router: Router,
              public dialog: MatDialog) {
    const id = this.route.snapshot.paramMap.get('docId');
    console.log(id);
    this.docId = id;
    const cityRef = this.firestore.collection('appData').doc(this.docId);
    const getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          console.log(doc.data().fields);
          this.collection.push(doc.data().fields);
          this.colId = doc.data().path;
          this.dataTypes = doc.data().datatypes;
          this.tableData = doc.data();
          console.log('fire lst1');

          const citiesRef = this.firestore.collection(doc.data().path);
          const allCities = citiesRef.get()
          .subscribe(snapshot => {
            snapshot.forEach(document => {
              let bool = true;
              const localData = document.data();
              // check all the fields are in the docs
              const Ref = this.firestore.collection(this.colId).doc(document.id);
              const data = {};
              for (const x of this.tableData.fields) {
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
                      data[x] = '';
                      localData[x] = '';
                      console.log('datetime');
                      break;
                    }
                    case 'geopoint': {
                      const gp = {
                        longitude: 0,
                        latitude: 0,
                      };
                      data[x] = gp;
                      localData[x] = gp;
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


    /*
    this.collection= this.fire.getModel(this.docId);
    this.setValues();
    this.collectionData=this.fire.getData(this.collectionData);*/




    /*let cityRef = this.firestore.collection('appData').doc(this.docId);
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


    // this.dataFields=this.collection[0];
    // this.dataS.currentData.subscribe(data=>this.dataN=data);

    // console.log(!(this.dataN.length==0));
    /*if(!(this.dataN.length==0)){
      console.log('a');
      this.dataX=this.dataN;
    }*/
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
    const cityRef = this.firestore.collection(this.colId).doc(row[0]);
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
      row[1][col].longitude = +event.target.value;
    } else {
      point.latitude = +event.target.value;
      point.longitude = row[1][col].longitude;
      /*for (let doc of this.collectionData){
        if(doc.id==row[0]){
          id =this.collectionData.indexOf(doc);
        }
      }*/
      row[1][col].latitude = +event.target.value;
    }

    data[col] = point;
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
      const cityRef = this.firestore.collection(this.colId).doc(row[0]);
      const data = {};
      data[col] = row[1][col];
      cityRef.update(data);
    }
  }

  updateValueArray(event, row, col, i) {
    // row[1][col][i]=event.target.value;
    if (this.tableData[col] === 'string') {
      row[1][col].splice(i, 1);
      row[1][col].splice(i, 0, event.target.textContent );
    }
    if (this.tableData[col] === 'number') {
      console.log(event.target.value);
      row[1][col].splice(i, 1);
      row[1][col].splice(i, 0, +event.target.value );
    }
    if (this.tableData[col] === 'boolean') {
      console.log('true' === event.target.value);
      // row[1][col][i]=!row[1][col][i];
      row[1][col].splice(i, 1);
      row[1][col].splice(i, 0, 'true' === event.target.value);
    }
    const cityRef = this.firestore.collection(this.colId).doc(row[0]);
    const data = {};
    data[col] = row[1][col];
    cityRef.update(data);

    console.log(row[1][col]);
  }

  updateValue(event, row, col) {
    const cityRef = this.firestore.collection(this.colId).doc(row[0]);
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
    console.log(row[0]);
    console.log(col);
    console.log(event.target.textContent);
    data[col] = event.target.textContent;
    cityRef.update(data);
  }

  add() {
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
          dt[entry] = '';
          console.log('datetime');
          break;
        }
        case 'geopoint': {
          const gp = {
            longitude: 0,
            latitude: 0,
          };
          dt[entry] = gp;
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
    const addDoc = this.firestore.collection(this.colId).add(
      dt
    ).then(ref => {
      console.log('Added document with ID: ', ref.id);
      newAddDoc = ref.id;
      // this.collectionData.push(addDoc);
      const cityRef = this.firestore.collection(this.colId).doc(newAddDoc);
      const getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          this.collectionData.push(doc);
          this.allData.push([doc.id, doc.data()]);
        }
      });
    });



    // console.log(this.collectionData);
  }

  remove(rowID) {
    if(confirm('Delete "' + rowID + '" and all its descendant properties?')){
      console.log('ok');
      console.log(rowID);
      for (const entry of this.collectionData) {
        if (entry.id === rowID) {
          const id = this.collectionData.indexOf(entry);
          this.firestore.collection(this.colId).doc(rowID).delete();
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
    return this.router.navigate(['']);
  }

  updateCheckBox(row, col) {
    console.log(!row[1][col]);
    const cityRef = this.firestore.collection(this.colId).doc(row[0]);
    const data = {};
    console.log(row[0]);
    console.log(col);
    data[col] = !row[1][col];
    cityRef.update(data);

  }

  updateDataType(eventVal, col) {
    const connection = this.firestore.collection('appData').doc(this.docId);
    console.log(eventVal);
    console.log(this.dataTypes[col]);
    switch (this.dataTypes[col]) {
      case 'string': {
        const upData = {};
        console.log('string');
        for (const i of this.allData) {
          const con = this.firestore.collection(this.colId).doc(i[0]);
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
          const con = this.firestore.collection(this.colId).doc(i[0]);
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
          const con = this.firestore.collection(this.colId).doc(i[0]);
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
          const con = this.firestore.collection(this.colId).doc(i[0]);
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
          const con = this.firestore.collection(this.colId).doc(i[0]);
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
      case 'geopoint': {
        const upData = {};
        for (const i of this.allData) {
          const con = this.firestore.collection(this.colId).doc(i[0]);
          i[1][col] = {
            longitude: 0,
            latitude: 0,
          };
          upData[col] = {
            longitude: 0,
            latitude: 0,
          };
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
        for (const i of this.allData) {
          const con = this.firestore.collection(this.colId).doc(i[0]);
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
          const con = this.firestore.collection(this.colId).doc(i[0]);
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
    const connection = this.firestore.collection('appData').doc(this.docId);
    console.log(event.target.value);
    // remove all the whitespaces of input
    newField = event.target.value.replace(/\s/g, '');
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
    const connection = this.firestore.collection('appData').doc(this.docId);
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
    const connection = this.firestore.collection('appData').doc(this.docId);
    dialogRef.afterClosed().subscribe(result => {
      // this.result = result;
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
      const data = {
        datatypes: this.dataTypes,
      };
      this.tableData[f] = flds;
      const upData = {};
      for (const i of this.allData) {
        const con = this.firestore.collection(this.colId).doc(i[0]);
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
    const connection = this.firestore.collection('appData').doc(this.docId);
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
        const con = this.firestore.collection(this.colId).doc(i[0]);
        i[1][f] = ops[0];
        upData[f] = ops[0];
        con.update(upData);
      }
      const data = {};
      data[f] = ops;
      connection.update(data);
    });
  }
}
