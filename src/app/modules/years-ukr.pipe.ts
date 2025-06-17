import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'yearsUkr'
})
export class YearsUkrPipe implements PipeTransform {

  transform(value: number | null): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;

    let suffix = 'років';

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      suffix = 'років';
    } else if (lastDigit === 1) {
      suffix = 'рік';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      suffix = 'роки';
    }

    return `${value} ${suffix}`;
  }
}
