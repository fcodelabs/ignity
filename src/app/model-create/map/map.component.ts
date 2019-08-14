import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MapComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
  addNewField(){
    this.data.fields.push({value:''});
  }
  getValue(event){
    console.log(event.target.value);
  }

}
