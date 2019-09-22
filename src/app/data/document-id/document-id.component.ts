import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-document-id',
  templateUrl: './document-id.component.html',
  styleUrls: ['./document-id.component.css']
})
export class DocumentIDComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DocumentIDComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
