import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-map-fields',
  templateUrl: './add-map-fields.component.html',
  styleUrls: ['./add-map-fields.component.css']
})
export class AddMapFieldsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddMapFieldsComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  addNewField() {
    this.data.fields.push({value: ''});
  }
  getValue(event) {
    console.log(event.target.value);
  }

}
