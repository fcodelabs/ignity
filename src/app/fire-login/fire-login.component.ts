import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FireConnectionService} from '../shared/fire-connection.service';

@Component({
  selector: 'app-fire-login',
  templateUrl: './fire-login.component.html',
  styleUrls: ['./fire-login.component.css']
})
export class FireLoginComponent implements OnInit {
  firebaseApp = {apiKey: '', authDomain: '', databaseURL: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: ''};
  apiKey = 'AIzaSyDSrdbgebIsyvK4vXeM9JXKAAsY6c-xOqs';
  authDomain = 'fir-cms-ae9d0.firebaseapp.com';
  databaseURL = 'https://fir-cms-ae9d0.firebaseio.com';
  projectId = 'fir-cms-ae9d0';
  storageBucket = 'fir-cms-ae9d0.appspot.com';
  messagingSenderId = '814248522504';
  appId = '1:814248522504:web:dd849efcd11e5a0d';
  constructor(private router: Router,
              private fireConnection: FireConnectionService) { }

  ngOnInit() {
  }

  onSetUp() {
    this.firebaseApp.apiKey = this.apiKey;
    this.firebaseApp.authDomain = this.authDomain;
    this.firebaseApp.databaseURL = this.databaseURL;
    this.firebaseApp.projectId = this.projectId;
    this.firebaseApp.storageBucket = this.storageBucket;
    this.firebaseApp.messagingSenderId = this.messagingSenderId;
    this.firebaseApp.appId = this.appId;
    this.fireConnection.setFireObj(this.firebaseApp);
    localStorage.setItem('firebaseData', JSON.stringify(this.firebaseApp));
    return this.router.navigate(['models']);
  }
}
