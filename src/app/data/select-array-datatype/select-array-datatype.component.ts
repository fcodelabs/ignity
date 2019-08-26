import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-select-array-datatype',
  templateUrl: './select-array-datatype.component.html',
  styleUrls: ['./select-array-datatype.component.css']
})
export class SelectArrayDatatypeComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SelectArrayDatatypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSelect() {
    console.log(this.data.arrayDataType);
  }
  ngOnInit() {
  }

}
