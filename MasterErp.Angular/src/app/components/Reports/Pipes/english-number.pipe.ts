import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'englishNumber'
})
export class EnglishNumberPipe implements PipeTransform {
  private ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  private teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  private tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  private thousandsGroups = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

  transform(num: number | string): string {
    if (num === 0 || num === '0') return 'Zero';

    let numberStr = num.toString().replace(/[^0-9\-]/g, '');
    if (numberStr === '') return '';

    let isNegative = false;
    if (numberStr.startsWith('-')) {
      isNegative = true;
      numberStr = numberStr.slice(1);
    }

    const groups = [];
    while (numberStr.length > 0) {
      groups.unshift(numberStr.slice(-3));
      numberStr = numberStr.slice(0, -3);
    }

    const words = [];

    for (let i = 0; i < groups.length; i++) {
      const groupNum = parseInt(groups[groups.length - 1 - i], 10);
      if (groupNum === 0) continue;

      const groupWords = this.convertHundreds(groupNum);
      const scale = this.thousandsGroups[i];
      words.unshift(groupWords + (scale ? ' ' + scale : ''));
    }

    let result = words.join(' ').trim();

    if (isNegative) {
      result = 'Negative ' + result;
    }

    return this.capitalizeWords(result);
  }

  private convertHundreds(num: number): string {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    let str = '';

    if (hundred > 0) {
      str += this.ones[hundred] + ' hundred';
      if (rest > 0) str += ' ';
    }

    if (rest > 10 && rest < 20) {
      str += this.teens[rest - 11];
    } else {
      const ten = Math.floor(rest / 10);
      const one = rest % 10;

      if (ten > 0) {
        str += this.tens[ten];
        if (one > 0) str += '-';
      }

      if (one > 0) {
        str += this.ones[one];
      }
    }

    return str;
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

}
