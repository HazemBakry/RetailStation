import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WebsiteService } from 'src/app/components/Main/services/website.service';

@Component({
  selector: 'app-website-subscribe',
  templateUrl: './website-subscribe.component.html',
  styleUrls: ['./website-subscribe.component.css','../../../../../styles-website.css']
})
export class WebsiteSubscribeComponent implements OnInit {
  Name: string;
  Phone: string;
  showLoader: boolean;

  constructor(private websiteService: WebsiteService, private toaster: ToastrService) { }

  ngOnInit(): void {
  }

  AddNewSubscriber() {
    // let model = {
    //   SubscriberId: 0,
    //   SubscriberImageId: 1,
    //   NameAr: this.Name,
    //   Phone1: this.Phone
    // }
    // this.showLoader = true;
    // this.websiteService.AddNewSubscriber(model).subscribe(data => {
    //   this.showLoader = false;
    //   if (data) {
    //     this.toaster.success('تم الاشتراك بنجاح');
    //   } else {
    //     this.toaster.error('فشل في الاشتراك');
    //   }
    // });
    // this.Name = '';
    // this.Phone = '';
  }

}
