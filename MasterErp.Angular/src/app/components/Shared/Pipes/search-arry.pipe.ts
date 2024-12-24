import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchArry'
})
export class SearchArryPipe implements PipeTransform {

    transform(items: any[], searchText: string, fields: string[]): any[] {
      if (!items || !searchText || !fields || fields.length === 0) {
        return items;
      }
  
      const lowerSearchText = searchText.toLowerCase();
  
      // Filter items by checking the search text in multiple fields
      return items.filter((item) =>
        fields.some((field) =>
          item[field]?.toString().toLowerCase().includes(lowerSearchText)
        )
      );
    }
  

  // transform(categories: any, searchText: any, property: string): any {
  //   if (searchText == null) { return categories; }

  //   return categories.filter(function (category) {
  //     if (category) {
  //       if (property) {

  //         return category[property]?.toLowerCase().indexOf(
  //           searchText.toLowerCase()) > -1;
  //       } else {

  //         return category.toLowerCase().indexOf(
  //           searchText.toLowerCase()) > -1;
  //       }
  //     }
  //   })
  // }

}
