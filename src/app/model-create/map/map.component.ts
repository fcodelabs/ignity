import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {OptionSelectionComponent} from '../option-selection/option-selection.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MapComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              public dialog: MatDialog) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  addNewField() {
    this.data.fields.push({value: ''});
  }
  getValue(event) {
    console.log(event.target.value);
    // this.data.dataTypes[event.target.value] = 'string';
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

    const dialogRef = this.dialog.open(OptionSelectionComponent, {
      width: '350px',
      data: {options}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.result = result;
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
      // const data = {};
      this.data.options[f] = ops;
      console.log(this.data.options[f]);
      // data[f] = ops;
      // let cityRef;
      /* if (this.docId == null) {
        cityRef = this.fs.collection('metadata').doc(this.modelName);
      } else {
        cityRef = this.fs.collection('metadata/' + this.fire.metadataDocPath[this.superColName] + '/subCollections').doc(this.modelName);
      }
      cityRef.update(data);*/
    });
  }

}
