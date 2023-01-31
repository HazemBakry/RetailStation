import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent implements OnInit {

  @Input() stats!: { title: string, icon: string, number: string | number, orderName: string, orderNumber: string | number };

  constructor() { }

  ngOnInit(): void {
  }

}
