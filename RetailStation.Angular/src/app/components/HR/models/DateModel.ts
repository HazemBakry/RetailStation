export interface DateModel {
    id: number;
    month: number;
    year: number;
    monthYear: string;
}

export function getSalaryDuesMonths(
  fromMonth: number,
  fromYear: number,
  toMonth: number,
  toYear: number
): DateModel[] {
  console.log("🚀 ~ toYear:", toYear)
  console.log("🚀 ~ toMonth:", toMonth)
  console.log("🚀 ~ fromYear:", fromYear)
  console.log("🚀 ~ fromMonth:", fromMonth)
  const result: DateModel[] = [];

  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  let id = 1;
  let current = new Date(fromYear, fromMonth - 1, 1); // month is 0-based
  const end = new Date(toYear, toMonth - 1, 1);

  while (current <= end) {
    result.push({
      id: id++,
      month: current.getMonth() + 1,
      year: current.getFullYear(),
      monthYear: `${arabicMonths[current.getMonth()]} - ${current.getFullYear()}`
    });

    current.setMonth(current.getMonth() + 1);
  }

  return result;
}

export function getSalaryDuesMonthss(fromDateStr: string, toDateStr: string): DateModel[] {
    if (!fromDateStr || !toDateStr) return [];
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);
    const result: DateModel[] = [];
    const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    let id = 1;
    let current = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

    while (current <= end) {
        result.push({
            id: id++,
            month: current.getMonth() + 1,
            year: current.getFullYear(),
            monthYear: `${arabicMonths[current.getMonth()]} - ${current.getFullYear()}`
        });

        current.setMonth(current.getMonth() + 1);
    }

    return result;
}
