import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModelComponent } from './model/model.component';
import { Router } from '@angular/router';
import { FireConnectionService } from '../shared/fire-connection.service';
import { retry, catchError } from 'rxjs/operators';
import { DataService } from '../shared/data.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {
 name='';
 collection='';
 result;
 modelList=[];
 data=[];
  constructor(public dialog: MatDialog,
              private router:Router,
              private fire:FireConnectionService,
              private dataS:DataService,
              private firestore:AngularFirestore) {
    
    let citiesRef = this.firestore.collection('appData');
    citiesRef.get()
      .subscribe(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          this.modelList.push(doc);
        });
        console.log(this.modelList);
      })
      err => {
        console.log('Error getting documents', err);
      };            
    
  }

  ngOnInit() {
    
  }

  getModels(){
    console.log(this.modelList);
  }

  onClick(docId){
    //fields.unshift('ID');
    console.log(docId);
    //this.data=[docId,fields];
    //this.dataS.changeData(this.data);
    return this.router.navigate(['/model/data',docId]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModelComponent, {
      width: '350px',
      data: {name: this.name, collection: this.collection}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      console.log('The dialog was closed');
      console.log(result == null);
      if(!(result==null)){
        console.log(result.name);
        console.log(result.collection);

        let data = {
          name: result.name,
          path: result.collection,
          fields:[],
          datatypes:{}
        };

        this.firestore.collection('appData').doc(result.name).set(data);

        return this.router.navigate(['/model-create',result.name]);
      }
    });
  }

  onEdit(docId){
    return this.router.navigate(['/model-create',docId]);
  }

  onDelete(docId){
    for (let entry of this.modelList){
      if(entry.id==docId){
        let id =this.modelList.indexOf(entry);
        this.firestore.collection('appData').doc(docId).delete();
        this.modelList.splice(id, 1);
      }
    }
  }

}
