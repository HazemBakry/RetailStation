import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nw-header',
  templateUrl: './nw-header.component.html',
  styleUrls: ['./nw-header.component.css'],
})
export class NwHeaderComponent implements OnInit {
  collapsed = true;

  constructor() {}

  ngOnInit(): void {}
}
