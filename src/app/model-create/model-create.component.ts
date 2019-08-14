import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FieldComponent } from './field/field.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MapComponent } from './map/map.component';
import { OptionSelectionComponent } from './option-selection/option-selection.component';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.css']
})
export class ModelCreateComponent implements OnInit {
  modelName='';
  result;
  field='';
  dataType='';
  fields=[];
  dataTypes={};
  allData=[];
  mapFields=[];
  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private firestore: AngularFirestore,
              private router: Router) { 
    let modelName=this.route.snapshot.paramMap.get('modelName');
    this.modelName=modelName;
    console.log(this.modelName);
    
    let cityRef = this.firestore.collection('appData').doc(modelName);
    cityRef.get()
    .subscribe(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        this.fields=doc.data().fields;
        this.dataTypes=doc.data().datatypes;
        this.allData.push(doc.data());
      }
    }
    ,err => {
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
      if(!(result==null)){
        console.log(result.field);
        console.log(result.dataType);
        this.fields.push(result.field);
        //let en={};
        //en[result.field]=result.dataType;
        this.dataTypes[result.field]=result.dataType;
        let cityRef = this.firestore.collection('appData').doc(this.modelName);

        if(result.dataType=='array'){
          let data={};
          data[result.field]='string';
          this.allData[0][result.field]='string';
          cityRef.update(data);
        }
        if(result.dataType=='map'){
          this.allData[0][result.field]=[];
          this.openDialogMap(result.field);
        }
        if(result.dataType=='optionselection'){
          this.allData[0][result.field]=[];
          this.openDialogOptionSelection(result.field);
        }

        cityRef.update({fields: this.fields});
        cityRef.update({datatypes:this.dataTypes});

      }
    });
  }

  onViewData(){
    return this.router.navigate(['/model/data',this.modelName]);
  }

  onBack(){
    return this.router.navigate(['']);
  }
  
  updateValue(event,f){
    console.log(event.target.value);
    let cityRef = this.firestore.collection('appData').doc(this.modelName);
    console.log(this.allData[0][f]);
    let data={};
    data[f]=event.target.value;
    cityRef.update(data);
  }

  openDialogMap(f): void {
    let mapFields=[];
    if(this.allData[0][f].length==0){
      mapFields=[{value:''}];
    }else{
      for (let x of this.allData[0][f]){
        let d={};
        d['value']=x;
        mapFields.push(d);
      }
    }
    

    const dialogRef = this.dialog.open(MapComponent, {
      width: '350px',
      data: {fields:mapFields}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result == null);
      let flds=[];
      if(!(result==null)){
        console.log(result.fields);
        for (let x of result.fields){
          if (x['value'] != ''){
            flds.push(x['value']);
          }
        }
      }else{
        return
      }
      let data={};
      this.allData[0][f]=flds;
      data[f]=flds;
      let cityRef = this.firestore.collection('appData').doc(this.modelName);
      cityRef.update(data);
    });
  }

  openDialogOptionSelection(f){
    let options=[];
    if(this.allData[0][f].length==0){
      options=[{value:''}];
    }else{
      for (let x of this.allData[0][f]){
        let d={};
        d['value']=x;
        options.push(d);
      }
    }

    const dialogRef = this.dialog.open(OptionSelectionComponent, {
      width: '350px',
      data: {options:options}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result == null);
      let ops=[];
      if(!(result==null)){
        console.log(result.options);
        for (let x of result.options){
          if (x['value'] != ''){
            ops.push(x['value']);
          }
        }
      }else{
        return
      }
      let data={};
      this.allData[0][f]=ops;
      data[f]=ops;
      let cityRef = this.firestore.collection('appData').doc(this.modelName);
      cityRef.update(data);
    });
  }


  /*add(){
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
    }*/
}
