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
  fireConfig = '{\n' +
    '  apiKey: "AIzaSyDSrdbgebIsyvK4vXeM9JXKAAsY6c-xOqs",\n' +
    '  authDomain: "fir-cms-ae9d0.firebaseapp.com",\n' +
    '  databaseURL: "https://fir-cms-ae9d0.firebaseio.com",\n' +
    '  projectId: "fir-cms-ae9d0",\n' +
    '  storageBucket: "fir-cms-ae9d0.appspot.com",\n' +
    '  messagingSenderId: "814248522504",\n' +
    '  appId: "1:814248522504:web:dd849efcd11e5a0d"\n' +
    '}';

  constructor(private router: Router,
              private fireConnection: FireConnectionService) { }

  ngOnInit() {
    /* this.firebaseApp = eval('(' + this.fireConfig + ')');
    this.apiKey = this.firebaseApp.apiKey;
    this.authDomain = this.firebaseApp.authDomain;
    this.databaseURL = this.firebaseApp.databaseURL;
    this.projectId = this.firebaseApp.projectId;
    this.storageBucket = this.firebaseApp.storageBucket;
    this.messagingSenderId = this.firebaseApp.messagingSenderId;
    this.appId = this.firebaseApp.appId; */
  }

  onSetUp() {
    // tslint:disable-next-line:no-eval
    console.log(eval('(' + this.fireConfig + ')') );
    // tslint:disable-next-line:no-eval
    this.firebaseApp = eval ('(' + this.fireConfig + ')');
    this.apiKey = this.firebaseApp.apiKey;
    this.fireConnection.setFireObj(this.firebaseApp);
    localStorage.setItem('firebaseData', JSON.stringify(this.firebaseApp));
    return this.router.navigate(['models']);
  }
}
