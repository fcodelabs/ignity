import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-database-path',
  templateUrl: './database-path.component.html',
  styleUrls: ['./database-path.component.css']
})
export class DatabasePathComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DatabasePathComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
