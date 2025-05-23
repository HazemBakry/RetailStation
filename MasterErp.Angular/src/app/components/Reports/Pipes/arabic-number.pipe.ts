import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicNumber'
})
export class ArabicNumberPipe implements PipeTransform {

  transform(num: number): string {
    if (num === 0) return 'صفر';

    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const teens = ['أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

    let result = '';

    const numStr = num.toString().padStart(4, '0');
    const [thousands, hundred, ten, one] = numStr.split('').map(Number);

    if (thousands > 0) {
      if (thousands === 1) {
        result += 'ألف';
      } else if (thousands === 2) {
        result += 'ألفان';
      } else if (thousands > 2 && thousands <= 10) {
        result += ones[thousands] + ' آلاف';
      }
    }

    if (hundred > 0) {
      if (result !== '') result += ' و ';
      result += hundreds[hundred];
    }

    if (ten === 1 && one > 0) {
      if (result !== '') result += ' و ';
      result += teens[one - 1];
    } else {
      if (ten > 1) {
        if (result !== '') result += ' و ';
        result += tens[ten];
      }
      if (one > 0) {
        if (result !== '') result += ' و ';
        result += ones[one];
      }
    }

    return result;
  }

}

