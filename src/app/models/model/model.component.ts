import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/*export interface DialogData {
  animal: string;
  name: string;
}*/

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data /*DialogData       -- interface data type*/) { }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
