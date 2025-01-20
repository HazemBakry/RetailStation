import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-erp-spinner-component',
  templateUrl: './erp-spinner-component.component.html',
  styleUrls: ['./erp-spinner-component.component.css']
})
export class ErpSpinnerComponentComponent implements OnInit {

  @Input() size:string = '72px';
  constructor() { }

  ngOnInit(): void {
  }


}
