import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrderDetailModel } from '../../../models/ItemModel';
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataField } from '../../../models/DataField';

@Component({
  selector: 'app-products-details-side-panel',
  templateUrl: './products-details-side-panel.component.html',
  styleUrls: ['./products-details-side-panel.component.css']
})
export class ProductsDetailsSidePanelComponent implements OnInit {
  @Input() detailsModel: OrderModel;
  @Input() productList: OrderProductModel[] = [];
  @Input() dataFields: DataField[] = [];
  @Input() title: string = 'تفاصيل';


  @ViewChild('DetailsSidePanel', { static: true }) DetailsSidePanel: TemplateRef<any>;

  constructor(private offcanvasService: NgbOffcanvas, private toaster: ToastrService) { }


  ngOnInit(): void {
  }
  openSidePanel(content: any = null) {
    if (content == null)
      this.offcanvasService.open(this.DetailsSidePanel, { panelClass: 'details-panel', position: 'end' });
    else
      this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
  getFieldValue(product: OrderProductModel, field: DataField): any {
    // Check if the field exists in the product and return its value
    if (product && product.hasOwnProperty(field.fieldName)) {
      return product[field.fieldName];
    }
    return null; // Return null or default value if the field is not found
  }
}
