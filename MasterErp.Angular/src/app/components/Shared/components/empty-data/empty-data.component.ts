import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.css']
})
export class EmptyDataComponent implements OnInit {
  @Input() showContainer:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

}
