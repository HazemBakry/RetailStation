import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SocialMediaPlatform } from '../models/SocialMediaPlatform';

@Injectable({
  providedIn: 'root',
})
export class PixelService {
  URL = environment.apiURL;


  constructor(private http: HttpClient) {}


  loadMetaPixel(pixelId: string): Promise<void> {
    // const fbqScript = `!function(f,b,e,v,n,t,s)
    // {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    // n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    // if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    // n.queue=[];t=b.createElement(e);t.async=!0;
    // t.src=v;s=b.getElementsByTagName(e)[0];
    // s.parentNode.insertBefore(t,s)}(window, document,'script',
    // 'https://connect.facebook.net/en_US/fbevents.js');`;

    // Inject the inline script
    // const inlineScript = document.createElement('script');
    // inlineScript.text = fbqScript;
    // document.head.appendChild(inlineScript);

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof (window as any).fbq !== 'undefined') {
          (window as any).fbq('init', pixelId);
          (window as any).fbq('track', 'PageView');
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  loadSnapchatPixel(pixelId: string): void {
    // const snapScript = `(function(w,d,t){
    //   w.snaptr=function(){
    //     w.snaptr.handleRequest? w.snaptr.handleRequest.apply(w.snaptr, arguments): w.snaptr.queue.push(arguments)};
    //   w.snaptr.queue=[];var s=d.createElement(t);s.async=!0;
    //   s.src='https://sc-static.net/scevent.min.js';
    //   var e=d.getElementsByTagName(t)[0];e.parentNode.insertBefore(s,e);
    // })(window,document,'script');`;
    // const inlineScript = document.createElement('script');
    // inlineScript.text = snapScript;
    // document.head.appendChild(inlineScript);

    const checkInterval = setInterval(() => {
      if (typeof (window as any).snaptr !== 'undefined') {
        (window as any).snaptr('init', pixelId);
        (window as any).snaptr('track', 'PAGE_VIEW');
        clearInterval(checkInterval);
      }
    }, 100);
  }

  loadPixels(platform: string, pixelId: string) {
    switch (platform.toLowerCase()) {
      case 'facebook':
        if (typeof (window as any).fbq !== 'undefined') {
          (window as any).fbq('init', pixelId);
          (window as any).fbq('track', 'PageView');
        }
        break;
      case 'snapchat':
        if (typeof (window as any).snaptr !== 'undefined') {
          (window as any).snaptr('init', pixelId);
          (window as any).snaptr('track', 'PAGE_VIEW');
        }
    }
  }

 removeExistingPixels(platform: string, pixelId: string) {
    var elem = document.getElementById(platform+"-"+pixelId);
    if(elem)
    elem.remove();
  }

  CancelOrderByOrderId(orderId: number[], VoidReason: string, Action: string, VoidNotes: string, UserId: string) {
    return this.http.post<any[]>(this.URL + 'Order/CancelOrderList?VoidReason=' + VoidReason + '&Action=' + Action + '&VoidNotes=' + VoidNotes + '&UserId=' + UserId, orderId);
  }


  getAllCustomersPixels()
  {
    return this.http.get<SocialMediaPlatform[]>(this.URL + 'SMPixel/GetAllCustomersPixels');
  }
   getPixelbyPlatformID(platformID: number)
  {
    return this.http.get<any>(this.URL + 'SMPixel/GetPixelbyPlatformID?platformID='+ platformID);
  }
  insertPixel(pixelID:string,socialMediaPlatform: SocialMediaPlatform)
  {
    return this.http.post<any[]>(this.URL + 'SMPixel/InsertSMPixel',socialMediaPlatform);
  }
   deletePixel(pixelID:string,platformID: number)
  {
    return this.http.delete<any[]>(this.URL + 'SMPixel/DeleteSMPixel?pixelId='+ pixelID + '&platformId='+platformID);
  }

injectPixels(platform:string, pixelId:string, pixelScript:string ){
  const finalScript = pixelScript.replace(/YOUR_PIXEL_ID/g, pixelId);
   const script = document.createElement('script');
    script.id = platform + '-' + pixelId;
    script.innerHTML = finalScript;
    document.head.appendChild(script);
}

loadAndInjectAllCustomerPixels(){
    this.getAllCustomersPixels()
      .subscribe({
        next: (data) => {
          data.forEach(pixel => {
            this.injectPixels(pixel.platform,pixel.pixelID,pixel.pixelScript);
            this.loadPixels(pixel.platform,pixel.pixelID);
          });
        },
        error: (error) => {
         console.log('ERRORRRRRRRRRRR',error);
        },
        complete: () => {},
      });
  }


}
