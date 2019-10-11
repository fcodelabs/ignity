import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OptionSelectionFieldsComponent} from '../option-selection-fields/option-selection-fields.component';

@Component({
  selector: 'app-add-map-fields',
  templateUrl: './add-map-fields.component.html',
  styleUrls: ['./add-map-fields.component.css']
})
export class AddMapFieldsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddMapFieldsComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              public dialog: MatDialog) { }

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

  openDialogOptionSelection(f) {
    console.log(f);
    let options = [];
    if (this.data.options[f] === undefined) {
      options = [{value: ''}];
    } else {
      for (const x of this.data.options[f]) {
        const d = {
          value: 0,
        };
        d.value = x;
        options.push(d);
      }
    }

    const dialogRef = this.dialog.open(OptionSelectionFieldsComponent, {
      width: '350px',
      data: {options}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result == null);
      const ops = [];
      if (!(result == null)) {
        console.log(result.options);
        for (const x of result.options) {
          if (x.value !== '') {
            ops.push(x.value.trim());
          }
        }
      } else {
        return;
      }
      this.data.options[f] = ops;
      console.log(this.data.options[f]);
    });
  }

}
