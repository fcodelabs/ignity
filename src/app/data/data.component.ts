import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import { FireConnectionService } from '../shared/fire-connection.service';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
//import { async } from '@angular/core/testing';
//import { deflateRawSync } from 'zlib';
//import { delay } from 'q';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  defaultDataTypes= [
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
  dataType='';
  editField='';
  docId='';
  colId='';
  collectionID='';
  collection=[];
  dataFields=[];
  collectionData=[];
  allData=[];
  dataTypes={};
  tableData;
  constructor(private firestore:AngularFirestore,
              private route: ActivatedRoute,
              private dataS:DataService,
              private fire:FireConnectionService,
              private router: Router) {
    let id=this.route.snapshot.paramMap.get('docId');
    console.log(id);
    this.docId=id;
    let cityRef = this.firestore.collection('appData').doc(this.docId);
    let getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          console.log(doc.data().fields)
          this.collection.push(doc.data().fields);
          this.colId=doc.data().path;
          this.dataTypes=doc.data().datatypes;
          this.tableData=doc.data();
          console.log('fire lst1');

          let citiesRef = this.firestore.collection(doc.data().path);
          let allCities = citiesRef.get()
          .subscribe(snapshot => { 
            snapshot.forEach(doc => {
              let bool=true;
              let localData=doc.data();
              //check all the fields are in the docs
              let Ref = this.firestore.collection(this.colId).doc(doc.id);
              let data={};
              for(let x of this.tableData.fields){
                if(doc.data()[x]==null){
                  console.log('error');
                  switch(this.dataTypes[x]) { 
                    case "string": { 
                      data[x] = "";
                      localData[x]="";
                      console.log("string"); 
                      break; 
                    } 
                    case "number": { 
                      data[x] = 0;
                      localData[x]=0;
                      console.log("number"); 
                      break; 
                    } 
                    case "boolean": {
                      data[x] = false;
                      localData[x]=false;
                      console.log("boolean"); 
                      break;    
                    } 
                    case "map": { 
                      let d={}
                      for (let f of this.tableData[x]){
                        d[f]='';
                      }
                      data[x] = d;
                      localData[x]=d;
                      console.log("map"); 
                      break; 
                    }  
                    case "array": {
                      data[x] = []; 
                      localData[x]=[];
                      console.log("array"); 
                      break;              
                    } 
                    case "datetime": { 
                      data[x] = "";
                      localData[x]="";
                      console.log("datetime"); 
                      break;              
                    } 
                    case "geopoint": {
                      let gp={};
                      gp['longitude']=0;
                      gp['latitude']=0;
                      data[x] = gp;
                      localData[x]=gp;
                      console.log("geopoint"); 
                      break;              
                    } 
                    case "database": { 
                      data[x] = "";
                      localData[x]="";
                      console.log("database"); 
                      break;              
                    } 
                    case "optionselection": { 
                      data[x] = this.tableData[x][0];
                      localData[x]=this.tableData[x][0];
                      console.log("optionselection"); 
                      break;              
                    } 
                    default:{
                      data[x] = "";
                      localData[x]="";
                      console.log("error[default]");
                      break;
                    }
                  }
                  bool=false;
                }else{
                  console.log('ok');
                }
              }
              Ref.update(data);
              console.log(doc.id, '=>', doc.data());
              this.collectionData.push(doc);
              this.allData.push([doc.id,localData]);
              //console.log(this.collectionData[0].data().field3);
            })
          }
        ,err => {
            console.log('Error getting documents', err);
        });

        }
      }
      ,err => {
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
    
  
    //this.dataFields=this.collection[0];
    //this.dataS.currentData.subscribe(data=>this.dataN=data);
    
    //console.log(!(this.dataN.length==0));
    /*if(!(this.dataN.length==0)){
      console.log('a');
      this.dataX=this.dataN;
    }*/
  }
  dataf(){
    console.log(this.dataFields);
  }


  changeValue(event,row,col){
    this.editField = event.target.textContent;
    if (this.editField != undefined){
      if (this.dataTypes[col]=="number"){
      }
    }
  }

  checkNumber(val){
    let newregex=/^[-+]?[0-9]*\.?[0-9]+$/;
    if(newregex.test(val)){
      return true;
    }else{
      return false;
    }
  }
  updateValueG(event,row,col,p){
    let cityRef = this.firestore.collection(this.colId).doc(row[0]);
    let data={};
    let point={};
    let id;
    if(p=='lon'){
      point['longitude']=+event.target.value;
      point['latitude']=row[1][col]['latitude'];
      /*for (let doc of this.collectionData){
        if(doc.id==row[0]){
          id =this.collectionData.indexOf(doc);
        }
      }*/
      //console.log(this.collectionData[id].data());
      row[1][col]['longitude']=+event.target.value;
    }else{
      point['latitude']=+event.target.value;
      point['longitude']=row[1][col]['longitude'];
      /*for (let doc of this.collectionData){
        if(doc.id==row[0]){
          id =this.collectionData.indexOf(doc);
        }
      }*/
      row[1][col]['latitude']=+event.target.value;
    }

    data[col]=point;
    cityRef.update(data);

  }

  addArrayValue(row,col){
    console.log('fine');
    if(this.tableData[col]=='string'){
      row[1][col].push('');
    }
    if(this.tableData[col]=='number'){
      row[1][col].push(0);
    }
    if(this.tableData[col]=='boolean'){
      row[1][col].push(false);
      let cityRef = this.firestore.collection(this.colId).doc(row[0]);
      let data={};
      data[col]=row[1][col];
      cityRef.update(data);
    }
  }

  updateValueArray(event,row,col,i){
    //row[1][col][i]=event.target.value;
    if(this.tableData[col]=='string'){
      row[1][col].splice(i,1);
      row[1][col].splice(i, 0,event.target.textContent );
    }
    if(this.tableData[col]=='number'){
      console.log(event.target.value);
      row[1][col].splice(i,1);
      row[1][col].splice(i, 0,+event.target.value );
    }
    if(this.tableData[col]=='boolean'){
      console.log('true'==event.target.value);
      //row[1][col][i]=!row[1][col][i];
      row[1][col].splice(i,1);
      row[1][col].splice(i, 0,'true'==event.target.value);
    }
    let cityRef = this.firestore.collection(this.colId).doc(row[0]);
    let data={};
    data[col]=row[1][col];
    cityRef.update(data);
    
    console.log(row[1][col]);
  }

  updateValue(event,row,col){
    let cityRef = this.firestore.collection(this.colId).doc(row[0]);
    let data={};
    if (this.dataTypes[col]=="boolean"){
      console.log(event.target.textContent);
      return
    }
    if (this.dataTypes[col]=="number"){
      console.log('in');
      console.log(+event.target.value);
      console.log(row[1][col]);
      data[col]=+event.target.value;
      if(isNaN(+event.target.value)){
        return
      }
      cityRef.update(data);
      return
    }
    if (this.dataTypes[col]=="geopoint"){
      console.log(+event.target.value);
      return
    }
    if (this.dataTypes[col]=="map"){
      console.log(event.target.textContent);
      console.log(row[1][col]);
      data[col]=row[1][col];
      cityRef.update(data);
      return
    }
    if (this.dataTypes[col]=="array"){
      console.log(row[1][col]);
      return
    }
    if(this.dataTypes[col]=='optionselection'){
      console.log(row[1][col]);
      data[col]=row[1][col];
      cityRef.update(data);
      return
    }
    console.log(row[0]);
    console.log(col);
    console.log(event.target.textContent);
    data[col]=event.target.textContent;
    cityRef.update(data);
  }

  add(){
    let newAddDoc='';
    let fields=this.collection[0];
    var dt = {};
    for (let entry of fields) {
      switch(this.dataTypes[entry]) { 
        case "string": { 
          dt[entry] = "";
          console.log("string"); 
          break; 
        } 
        case "number": { 
          dt[entry] = 0;
          console.log("number"); 
          break; 
        } 
        case "boolean": {
          dt[entry] = false;
          console.log("boolean"); 
          break;    
        } 
        case "map": { 
          let d={}
          for (let f of this.tableData[entry]){
            d[f]='';
          }
          dt[entry] = d;
          console.log("map"); 
          break; 
        }  
        case "array": {
          dt[entry] = []; 
          console.log("array"); 
          break;              
        } 
        case "datetime": { 
          dt[entry] = "";
          console.log("datetime"); 
          break;              
        } 
        case "geopoint": {
          let gp={};
          gp['longitude']=0;
          gp['latitude']=0;
          dt[entry] = gp;
          console.log("geopoint"); 
          break;              
        } 
        case "database": { 
          dt[entry] = "";
          console.log("database"); 
          break;              
        } 
        case "optionselection": { 
          dt[entry] = this.tableData[entry][0];
          console.log("optionselection"); 
          break;              
        } 
        default:{
          dt[entry] = "";
          console.log("error[default]");
          break;
        }
      }
    }
    let addDoc = this.firestore.collection(this.colId).add(
      dt
    ).then(ref => {
      console.log('Added document with ID: ', ref.id);
      newAddDoc=ref.id;
      //this.collectionData.push(addDoc);
      let cityRef = this.firestore.collection(this.colId).doc(newAddDoc);
      let getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          this.collectionData.push(doc);
          this.allData.push([doc.id,doc.data()])
        }
      })
      err => {
        console.log('Error getting document', err);
      };
    });

    
    
    //console.log(this.collectionData);
  }

  remove(rowID){
    console.log(rowID);
    for (let entry of this.collectionData){
      if(entry.id==rowID){
        let id =this.collectionData.indexOf(entry);
        this.firestore.collection(this.colId).doc(rowID).delete();
        this.collectionData.splice(id, 1);
        this.allData.splice(id,1);
        break;
      }
    }
  }

  getValue(row,col){  
    return row.data()[col];
  }

  onHome(){
    return this.router.navigate(['']);
  }

  updateCheckBox(row,col){
    console.log(!row[1][col]);
    let cityRef = this.firestore.collection(this.colId).doc(row[0]);
    let data={};
    console.log(row[0]);
    console.log(col);
    data[col]=!row[1][col];
    cityRef.update(data);

  }

  updateDataType(eventVal,col){
    console.log(eventVal);
    console.log(this.dataTypes[col]);
    let cityRef = this.firestore.collection('appData').doc(this.docId);
    let data={};
    data['datatypes']=this.dataTypes;
    cityRef.update(data);
  }
}
