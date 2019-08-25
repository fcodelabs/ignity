import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModelComponent } from './model/model.component';
import { Router } from '@angular/router';
import { FireConnectionService } from '../shared/fire-connection.service';
import { DataService } from '../shared/data.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {
 name = '';
 collection = '';
 result;
 modelList = [];
 modelIdList = [];
 modelNameList = [];
 data = [];
  constructor(public dialog: MatDialog,
              private router: Router,
              private fire: FireConnectionService,
              private dataS: DataService,
              private firestore: AngularFirestore) {

    const citiesRef = this.firestore.collection('appData');
    citiesRef.get()
      .subscribe(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          this.modelIdList.push(doc.id);
          this.modelNameList.push(doc.data().path)
          this.modelList.push(doc);
        });
        console.log(this.modelList);
      });
  }

  ngOnInit() {

  }

  getModels() {
    console.log(this.modelList);
  }

  onClick(docId) {
    // fields.unshift('ID');
    console.log(docId);
    // this.data=[docId,fields];
    // this.dataS.changeData(this.data);
    return this.router.navigate(['/model/data', docId]);
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
      if (!(result == null)) {

        if (this.modelIdList.includes(result.name)||(this.modelNameList.includes(result.collection)) ) {
          console.log(result.name);
          alert('there is already existing a model with path name "' + result.collection + '" or model name "'+ result.name + '"');
        } else {
          const data = {
            name: result.name,
            path: result.collection,
            fields: [],
            datatypes: {}
          };

          this.firestore.collection('appData').doc(result.name).set(data);

          return this.router.navigate(['/model-create', result.name]);
        }
        console.log(result.collection);
      }
    });
  }

  onEdit(docId) {
    return this.router.navigate(['/model-create', docId]);
  }

  onDelete(docId) {
    for (const entry of this.modelList) {
      if (entry.id === docId) {
        const id = this.modelList.indexOf(entry);
        this.firestore.collection('appData').doc(docId).delete();
        this.modelList.splice(id, 1);
      }
    }
  }

}
