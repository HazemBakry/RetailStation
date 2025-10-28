import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { PixelService } from '../../services/pixel.service';
import { SocialMediaPlatform } from '../../models/SocialMediaPlatform';

@Component({
  selector: 'app-social-media-pixels',
  templateUrl: './social-media-pixels.component.html',
  styleUrls: ['./social-media-pixels.component.css'],
})
export class SocialMediaPixelsComponent implements OnInit {
  TitleList = ['إدارة النظام', 'Social Media'];

  constructor(
    private pixelService: PixelService,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
  }
  platforms: SocialMediaPlatform[] = [
    {
      platformID: 1,
      platform: 'facebook',
      displayName: 'Facebook',
      pixelScript: `!function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');`,
      pixelID: '',
    },
    {
      platformID: 2,
      platform: 'X.com',
      displayName: 'X.com',
      pixelScript: `<!-- Twitter Pixel Code -->
  !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
  },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
  a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
  twq('init','YOUR_PIXEL_ID');
  twq('track','PageView');`,
      pixelID: '',
    },
    {
      platformID: 3,
      platform: 'tiktok',
      displayName: 'TikTok',
      pixelScript: `<!-- TikTok Pixel Code -->
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    ttq.load('YOUR_PIXEL_ID');
    ttq.page();
  }(window, document, 'ttq');`,
      pixelID: '',
    },
    {
      platformID: 4,
      platform: 'snapchat',
      displayName: 'Snapchat',
      pixelScript: `<!-- Snapchat Pixel Code -->
      (function(w,d,t){
      w.snaptr=function(){
        w.snaptr.handleRequest? w.snaptr.handleRequest.apply(w.snaptr, arguments): w.snaptr.queue.push(arguments)};
      w.snaptr.queue=[];var s=d.createElement(t);s.async=!0;
      s.src='https://sc-static.net/scevent.min.js';
      var e=d.getElementsByTagName(t)[0];e.parentNode.insertBefore(s,e);
    })(window,document,'script');`,
      pixelID: '',
    },
  ];

  selectedPlatform: SocialMediaPlatform | null = null;
  pixelId: string = '';
  isInjected: boolean = false;

  onPlatformSelect() {
    if (this.selectedPlatform) {
      this.pixelService
        .getPixelbyPlatformID(this.selectedPlatform.platformID)
        .subscribe({
          next: (data) => {
            if (data?.pixelID) {
              this.pixelId = data.pixelID;
              this.isInjected = true;
            } else {
              this.pixelId = '';
              this.isInjected = false;
            }
          },
          error: () => {
            this.toaster.error('Error happened');
            this.isInjected = false;
          },
          complete: () => { },
        });
    }
  }

  injectPixel() {
    if (!this.selectedPlatform || !this.pixelId) return;

    this.selectedPlatform.pixelID = this.pixelId;
    // Remove any existing pixels first
    this.pixelService.removeExistingPixels(
      this.selectedPlatform.platform,
      this.pixelId
    );



    this.pixelService
      .insertPixel(this.pixelId, this.selectedPlatform)
      .subscribe({
        next: (data) => {
          if (data) {
            this.toaster.success('Pixel Added Successfully');
          } else {
            this.toaster.error("Can't add pixel, Please try again later");
          }
        },
        error: () => {
          this.toaster.error("Can't Add Pixel, Please try again later");
          this.isInjected = false;
        },
        complete: () => { },
      });

    // Create and inject the script
    this.pixelService.injectPixels(this.selectedPlatform.platform, this.pixelId, this.selectedPlatform.pixelScript)

    this.isInjected = true;

    this.pixelService.loadPixels(this.selectedPlatform.platform, this.pixelId);
  }




  removeExistingPixels() {
    this.pixelService
      .deletePixel(this.pixelId, this.selectedPlatform.platformID)
      .subscribe({
        next: (data) => {
          if (data) {
            this.toaster.success('Pixel Removed Successfully');
          } else {
            this.toaster.error("Can't Remove Pixel, Please try again later");
          }
          this.isInjected = false;
        },
        error: () => {
          this.toaster.error("Can't Remove Pixel, Please try again later");
          this.isInjected = false;
        },
        complete: () => { },
      });
    this.pixelService.removeExistingPixels(
      this.selectedPlatform.platform,
      this.pixelId
    );
  }
}
