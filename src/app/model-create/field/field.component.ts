import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  dataTypes= [
    {value: 'string', viewValue: 'String'},
    {value: 'number', viewValue: 'Number'},
    {value: 'boolean', viewValue: 'Check Box'},
    {value: 'map', viewValue: 'Map'},
    {value: 'array', viewValue: 'Array'},
    {value: 'datatime', viewValue: 'Data Time'},
    {value: 'geopoint', viewValue: 'Geo Point'},
    {value: 'database', viewValue: 'Data Base'},
    {value: 'optionselection', viewValue: 'Option Selection'},
  ];

  constructor(public dialogRef: MatDialogRef<FieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
