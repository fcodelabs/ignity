import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { delay } from 'q';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FireConnectionService {
  public washingtonRef: AngularFirestoreDocument;
  lst = [];
  lst1 = [];
  lst2 = [];
  fireObj = {};
  fireName = '';
  fs;
  fsboo = false;
  fireConnection = {};
  path = {};
  fireConStr = {};
  subColMetadata = {};
  superColPath = {};

  constructor(// public firestore: AngularFirestore
    ) { }

  // firebase setting up methods (new code for fire connect interface
  setFireObj(obj) {
    this.fireObj = obj;
    this.fireName = obj.appId;
    this.initFire();
  }

  getFireObj() {
    return this.fireObj;
  }

  initFire() {
    console.log('in initfire()');
    if (firebase.apps.length) {
      const len = firebase.apps.length;
      const newFirebase = firebase.initializeApp(this.getFireObj(), this.fireName + (len.toString()));
      this.fs = newFirebase.firestore();
    } else {
      firebase.initializeApp(this.getFireObj());
      this.fs = firebase.firestore();
    }
  }
  // send sub-collection access
  setConnection(id, con) {
    this.fireConnection[id] = con;
    let cache = [];
    // tslint:disable-next-line:only-arrow-functions
    localStorage.setItem('fireConnection', JSON.stringify(this.fireConnection, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Duplicate reference found, discard key
          return;
        }
        cache.push(value);
      }
      return value;

    }));
  }

  getConnection(id) {
    return this.fireConnection[id];
  }

  setPath(id, path) {
    this.path[id] = path;
    localStorage.setItem('path', JSON.stringify(this.path));
  }

  getPath(id) {
    return this.path[id];
  }

  // method to create and return firestore connection
  getFireConnection(lst, obj) {
    let objf = obj;
    let i = 0;
    for (const x of lst) {
      if ( i % 2 === 0 ) {
        objf = objf.collection(x);
      } else {
        objf = objf.doc(x);
      }
      i = i + 1;
    }
    return objf;
  }
  // old code
  async getModels() {
    const citiesRef = this.fs.collection('appData');
    const allCities = citiesRef.get()
      .subscribe(snapshot => {
        snapshot.forEach(doc => {
          this.lst.push(doc);
          // console.log(this.lst[0])
          // console.log(typeof doc.data());
          console.log(doc.id, '=>', doc.data());
          // console.log(typeof this.lst[0]);
        });
      });
    // tslint:disable-next-line:no-unused-expression
    err => {
        console.log('Error getting documents', err);
    };
    // console.log(this.lst[0]);
  }
  returnModels() {
    this.getModels();
    return this.lst;
  }
  /*getModel(docId){
    let cityRef = this.firestore.collection('appData').doc(docId);
    let getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          console.log(doc.data().fields)
          this.lst1.push(doc.data().fields);
          console.log('fire lst1');
          console.log(this.lst1);
        }
      })
      err => {
        console.log('Error getting document', err);
      };
      await delay(5000);
      return this.lst1;
    }
    async getData(collectionID){
      let citiesRef = this.firestore.collection(collectionID);
        let allCities = citiesRef.get()
        .subscribe(snapshot => {
          snapshot.forEach(doc => {
            this.lst2.push(doc);
            console.log(doc.id, '=>', doc.data());
          });
        })
      err => {
          console.log('Error getting documents', err);
      };
      await delay(6000);
      return this.lst2;
    }*/




  pushData() {
    this.fs.collection('cities').doc('DC').set({
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    })
    // tslint:disable-next-line:only-arrow-functions
    .then(function() {
      console.log('Document successfully written!');
    })
    // tslint:disable-next-line:only-arrow-functions
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });
    }

  update() {
    this.washingtonRef = this.fs.collection('cities').doc('DC');

    // Set the "capital" field of the city 'DC'
    return this.washingtonRef.update({
        president: 'Prabhanu G'
    })
    // tslint:disable-next-line:only-arrow-functions
    .then(function() {
        console.log('Document successfully updated!');
    })
    // tslint:disable-next-line:only-arrow-functions
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
    });
    }

  get() {
    const cityRef = this.fs.collection('cities').doc('LA');
    const getDoc = cityRef.get()
      .subscribe(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
        }
      });
    // tslint:disable-next-line:no-unused-expression
    err => {
        console.log('Error getting document', err);
      };
    }


    getAll() {
      const citiesRef = this.fs.collection('cities');
      const allCities = citiesRef.get()
      .subscribe(snapshot => {
        snapshot.forEach(doc => {
          this.lst.push(doc.data());
          console.log(typeof doc.data());
          console.log(doc.id, '=>', doc.data());
          console.log(typeof this.lst[0]);
        });
      });
      // tslint:disable-next-line:no-unused-expression
      err => {
        console.log('Error getting documents', err);
      };
      console.log(this.lst[0]);
    }
}
