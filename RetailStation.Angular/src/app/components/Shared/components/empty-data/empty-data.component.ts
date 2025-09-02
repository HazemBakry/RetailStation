import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.css']
})
export class EmptyDataComponent implements OnInit {
  @Input() showEmptyData:boolean=false;
  @Input() showLoader:boolean=false;
  systemUrl:string=environment.systemUrl;
  constructor() { }
  
  ngOnInit(): void {
  }

}
