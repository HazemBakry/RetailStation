import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-received-orders',
  templateUrl: './received-orders.component.html',
  styleUrls: ['./received-orders.component.css']
})

export class ReceivedOrdersComponent implements OnInit {
  OrderList: any[] = [];
  showLoader: boolean;

  constructor(private inventoryService: InventoryService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader=true;
    this.inventoryService.GetReceiveOrdersData().subscribe(data => {
      this.OrderList = data;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  // CancelPurchaseInvoice(InvoiceId:number)
  // {
  //   this.purchaseService.CancelPurchaseInvoice(InvoiceId).subscribe(data => {
  //     if (data) {
  //       this.toaster.success('تم الغاء الطلب بنجاح');
  //       this.GetPurchaseInvoiceData();
  //     }
  //     else{
  //       this.toaster.error('حدث خطأ اثناء الألغاء');

  //     }
  //   },(error)=>{
  //     this.toaster.error('حدث خطأ اثناء الألغاء');

  //   })


  // }

}
