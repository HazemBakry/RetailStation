import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfService {

  constructor(private datePipe: DatePipe) { }

  generatePdf(element: HTMLElement) {
    const date = new Date();
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd_HH-mm-ss');

    const options = {
      margin: 5,
      filename: 'Indebtedness_' + formattedDate + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };

    html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
      const url = pdf.output('bloburl');
      window.open(url, '_blank');
    });
  }

  generatePdfFromHtmlString(htmlContent: string) {
    const date = new Date();
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd_HH-mm-ss');

    const options = {
      margin: 5,
      filename: 'Indebtedness_' + formattedDate + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };

    // ✅ أهم نقطة هنا: استخدم from() مع HTML string
    html2pdf().from(htmlContent).set(options).toPdf().get('pdf').then((pdf) => {
      const pdfUrl = pdf.output('bloburl');
      window.open(pdfUrl, '_blank');
    });
  }
}
