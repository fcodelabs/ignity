import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-option-selection-fields',
  templateUrl: './option-selection-fields.component.html',
  styleUrls: ['./option-selection-fields.component.css']
})
export class OptionSelectionFieldsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OptionSelectionFieldsComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  addNewField() {
    this.data.options.push({value: ''});
  }

}
