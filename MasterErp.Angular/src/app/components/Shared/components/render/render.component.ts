import { Component, Input, OnInit } from '@angular/core';
import { FieldType } from '../../Enums/FieldType';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css']
})
export class RenderComponent implements OnInit {

  @Input() value:any;
  @Input() fieldType:FieldType=FieldType.Text;

  public FieldType = FieldType;
  constructor() { }

  ngOnInit(): void {
  }

}
