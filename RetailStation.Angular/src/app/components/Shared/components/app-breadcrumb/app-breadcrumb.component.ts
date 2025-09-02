import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app-breadcrumb.component.html',
  styleUrls: ['./app-breadcrumb.component.css']
})
export class AppBreadcrumbComponent implements OnInit {
  @Input() TitleList: any[]
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
