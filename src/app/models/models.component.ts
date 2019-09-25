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
 superColName;
 paths = [];
 allDocs = [];
 selectedDoc = '';
 subCollections = [];
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
    this.docId = this.route.snapshot.paramMap.get('superColPath');
    this.superColName = this.route.snapshot.paramMap.get('superColName');
    let citiesRef;
    this.fs = fire.fs;
    if (this.docId != null) {
      if (Object.keys(this.fire.metadataDocPath).length === 0) {
        this.fire.metadataDocPath = JSON.parse(localStorage.getItem('metadataDocPath'));
        this.fire.collectionPath = JSON.parse(localStorage.getItem('collectionPath'));
        this.fire.fireConStr = JSON.parse(localStorage.getItem('fireConStr'));
      }
      if (Object.keys(this.fire.path).length === 0) {
        this.fire.path = JSON.parse(localStorage.getItem('path'));
      }
      const fsObj = 'metadata/' + this.fire.metadataDocPath[this.superColName];
      console.log(fsObj);
      this.path = this.fire.path[this.superColName];
      citiesRef = this.fs.collection(fsObj + '/subCollections');

      const connection = this.fs.collection(this.fire.collectionPath[this.superColName]);
      connection.get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            this.allDocs.push(doc.id);
          });
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
      console.log(this.allDocs);

      /* const connectionSCMD = this.fs.doc('metadata/' + this.fire.metadataDocPath[this.superColName]);
      connectionSCMD.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            console.log('Document data:', doc.data());
            this.subCollections = doc.data().subCollections;
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });*/
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
          this.subCollections.push(doc.id);
        });
        console.log(this.modelList);
      }).catch(err => {
      console.log('Error getting documents', err);
    });
    console.log(this.subCollections);
    /* for (const col of this.fire.superColPath[this.docId]) {
      let paths = [];
      let connection;
      if (this.paths === [] ) {
        connection = this.fireObj.collection(col);
        citiesRef.get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data());
              paths.push(doc.id);
            });
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
        this.paths = paths;
        paths = [];
      } else {
        for (let path of this.paths) {
          path = path + '/' + col;
          paths = paths.concat(this.getAllDocPaths(path));
        }
        this.paths = paths;
        paths = [];
      }
    }*/

  }

  getAllDocPaths(path) {
    const paths = [];
    const connection = this.fs.collection(path);
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
    return paths;
  }


  ngOnInit() {

  }

  getModels() {
    console.log(this.modelList);
  }

  onClick(docId, colPath) {
    console.log(docId);
    if (this.docId == null) {
      return this.router.navigate(['/models/data', docId, colPath]);
    } else {
      if (this.selectedDoc === '') {
        alert('Please Select A Document !');
      } else {
        return this.router.navigate(['/models/data', docId, this.docId, colPath, this.superColName, this.selectedDoc]);
      }
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
            datatypes: {},
            subCollections : []
          };
          /* for (const path of this.paths) {
            this.fs.collection(path + '/' + result.collection).add({});
          }*/
          this.subCollections.push(result.name);
          if ( this.docId == null ) {
            this.fs.collection('metadata').doc(result.name).set(data);
            /* this.fs.collection('metadata').doc(this.superColName).update({
              subCollections: firebase.firestore.FieldValue.arrayUnion(result.name)
            });*/
            return this.router.navigate(['/model-create', result.name]);
          } else {
            const fsObj = 'metadata/' + this.fire.metadataDocPath[this.superColName];
            this.fs.collection(fsObj + '/subCollections').doc(result.name).set(data);
            this.fs.doc(fsObj).update({
              subCollections: firebase.firestore.FieldValue.arrayUnion(result.name)
            });
            return this.router.navigate(['/model-create', this.superColName, this.docId, result.name, result.collection]);
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
      return this.router.navigate(['/model-create', this.superColName, this.docId, docId, colPath]);
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
            this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(docId).delete();
            const dataDel = {subCollections: this.subCollections};
            const x = this.subCollections.indexOf(docId);
            this.subCollections.splice(x, 1);
            dataDel.subCollections = this.subCollections;
            this.fs.doc('metadata/' + this.fire.metadataDocPath[this.superColName]).update(dataDel);
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

  selectDoc(doc) {
    this.selectedDoc = doc;
    console.log(this.selectedDoc);
  }

}
