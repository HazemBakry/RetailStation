import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.css']
})
export class OverviewCardComponent implements OnInit {

  @Input() data!: { title: string, number: number, status: string, statusIcon: string, subscribers: number, statusBgClass: string };

  constructor() { }

  ngOnInit(): void {
  }

}
