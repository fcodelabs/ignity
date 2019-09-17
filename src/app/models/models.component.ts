import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModelComponent } from './model/model.component';
import {ActivatedRoute, Router} from '@angular/router';
import { FireConnectionService } from '../shared/fire-connection.service';
import { DataService } from '../shared/data.service';
import * as firebase from 'firebase';
// import { AngularFirestore } from '@angular/fire/firestore';


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
 fs;
 docId;
 fireObj;
 path = '';
  constructor(public dialog: MatDialog,
              private router: Router,
              private fire: FireConnectionService,
              private dataS: DataService,
              private route: ActivatedRoute
              // private firestore: AngularFirestore
  ) {
    if (Object.keys(this.fire.fireObj).length === 0) {
      const data = JSON.parse(localStorage.getItem('firebaseData'));
      this.fire.setFireObj(data);
      console.log('in');
    }
    const id = this.route.snapshot.paramMap.get('docId');
    this.docId = id;
    let citiesRef;
    this.fs = fire.fs;
    if (id != null) {
      if (Object.keys(this.fire.fireConStr).length === 0) {
        this.fire.fireConStr = JSON.parse(localStorage.getItem('fireConStr'));
      }
      const lst = this.fire.fireConStr[id];
      const obj = this.fs;
      this.fireObj = this.fire.getFireConnection(lst, obj);
      if (Object.keys(this.fire.path).length === 0) {
        this.fire.path = JSON.parse(localStorage.getItem('path'));
      }
      console.log(id);
      this.path = this.fire.getPath(this.docId);
      citiesRef = this.fireObj.collection('metadata');
    } else {
      citiesRef = this.fs.collection('metadata');
      this.path = 'raw';
    }

    citiesRef.get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          this.modelIdList.push(doc.id);
          this.modelNameList.push(doc.data().path);
          this.modelList.push(doc);
        });
        console.log(this.modelList);
      }).catch(err => {
      console.log('Error getting documents', err);
    });
  }

  ngOnInit() {

  }

  getModels() {
    console.log(this.modelList);
  }

  onClick(docId, colPath) {
    // fields.unshift('ID');
    console.log(docId);
    // this.data=[docId,fields];
    // this.dataS.changeData(this.data);
    if (this.docId == null) {
      return this.router.navigate(['/models/data', docId]);
    } else {
      return this.router.navigate(['/models/data', docId, this.docId, colPath]);
    }
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

        if (this.modelIdList.includes(result.name) || (this.modelNameList.includes(result.collection)) ) {
          console.log(result.name);
          alert('there is already existing a model with path name "' + result.collection + '" or model name "' + result.name + '"');
        } else {
          const data = {
            name: result.name,
            path: result.collection,
            fields: [],
            datatypes: {}
          };

          if ( this.docId == null ) {
            this.fs.collection('metadata').doc(result.name).set(data);
            return this.router.navigate(['/model-create', result.name]);
          } else {
            this.fireObj.collection('metadata').doc(result.name).set(data);
            return this.router.navigate(['/model-create', this.docId, result.name, result.collection]);
          }
        }
        console.log(result.collection);
      }
    });
  }

  onEdit(docId, colPath) {
    if (this.docId == null) {
      return this.router.navigate(['/model-create', docId]);
    } else {
      return this.router.navigate(['/model-create', this.docId, docId, colPath]);
    }
  }

  onDelete(docId) {
    if (confirm('delete "' + docId + '" model ?')) {
      console.log('ok');
      for (const entry of this.modelList) {
        if (entry.id === docId) {
          const id = this.modelList.indexOf(entry);
          if (this.docId == null) {
            this.fs.collection('metadata').doc(docId).delete();
          } else {
            this.fireObj.collection('metadata').doc(docId).delete();
          }
          this.modelList.splice(id, 1);
        }
      }
    } else {
      console.log('cancel');
    }
  }

  onSwitchApp() {
    console.log(firebase.apps.length);
    localStorage.removeItem('firebaseData');
    return this.router.navigate(['']);
  }

}
