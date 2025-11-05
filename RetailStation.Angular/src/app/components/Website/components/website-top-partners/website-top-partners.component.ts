import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { environment } from 'src/environments/environment';
import { SliderModel } from 'src/app/components/Admin/models/Operation/SliderModel';
import { WebsiteService } from '../../services/website.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { RetailStationLogos } from '../website-home/website-home.component';

@Component({
  selector: 'app-website-top-partners',
  templateUrl: './website-top-partners.component.html',
  styleUrls: ['./website-top-partners.component.css']
})
export class WebsiteTopPartnersComponent implements OnInit {
  @Input() searchText: string
  @Input() activeCategoryId: number 
  retailStationLogos: RetailStationLogos[] = [
    // {
    //   name: 'Shell',
    //   logo: 'https://1000logos.net/wp-content/uploads/2024/08/Shell-Logo.png',
    // },
    // {
    //   name: 'TotalEnergies',
    //   logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/54/TotalEnergies_logo.svg/1200px-TotalEnergies_logo.svg.png',
    // },
    // {
    //   name: 'ExxonMobil',
    //   logo: 'https://download.logo.wine/logo/ExxonMobil/ExxonMobil-Logo.wine.png',
    // },
    // {
    //   name: 'BP',
    //   logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Bp_logo1961.png',
    // },
    // {
    //   name: 'Caltex',
    //   logo: 'https://images.seeklogo.com/logo-png/2/2/caltex-logo-png_seeklogo-25055.png',
    // },
    // {
    //   name: 'Esso',
    //   logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Esso-Logo.svg/1200px-Esso-Logo.svg.png',
    // },
    // {
    //   name: 'Emarat',
    //   logo: 'https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo.png',
    // },
    // {
    //   name: 'ENOC',
    //   logo: 'https://autostarcompany.com/en/assets/uploads/2021/11/enoc-products.png',
    // },
    // {
    //   name: 'ADNOC',
    //   logo: 'https://arda.africa/wp-content/uploads/2022/08/Arda_Sponsor_Logos_Gold_Adnoc.png',
    // },
    // {
    //   name: 'PetroChina',
    //   logo: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Petrochina_logo.svg',
    // },
  ];

  constructor(config: NgbCarouselConfig,
    private websiteService: WebsiteService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTopPartners();
  }


  getTopPartners() {
    this.retailStationLogos = [];
    this.websiteService.GetTopPartners().subscribe(data => {
      data?.forEach(partner => {
        this.retailStationLogos.push({
          name: partner.displayName,
          logo: partner.imageURL
        });
      });
    }, err => {
    }, () => {
    });
  }

}
