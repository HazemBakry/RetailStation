import { HttpClient } from "@angular/common/http";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Subscription, catchError, map, of } from "rxjs";

const validCharacters = /[^\s\w,.:&\/()+%'`@-]/;
const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

export class CustomValidators extends Validators{

  
  static validateCharacters(control: FormControl) {
    
      // first check if the control has a value
      if (control.value && control.value.length > 0) {
          
        // match the control value against the regular expression
        const matches = control.value.match(validCharacters);
        
        // if there are matches return an object, else return null.
        return matches && matches.length ? { invalid_characters: matches } : null;
      } else {
        return null;
      }
  }

  static validateURL(control: FormControl) {
    if (control.value && control.value.length > 0) {
      const isValid = urlPattern.test(control.value);
      return isValid ? null : { invalid_URL: {value :control.value}   };
    } else {
      return null;
    }
  }

  static extensionValidator(allowedExtensions:string[]=['jpg', 'jpeg', 'png']) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value ) {
        const fileExtension = control.value.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          return { invalidExtension: allowedExtensions };
        }
        
      }
      return null;
    };

  }
  
  static endDateGreaterThanStartDate(startDateCName: string, endDateCName: string,message=null): ValidatorFn {
    return (formGroup: AbstractControl) => {
      
      const startDate_C = formGroup.get(startDateCName);
      const endDate_C = formGroup.get(endDateCName);
      
      if (startDate_C?.value && endDate_C?.value) {
        const startDate = new Date(startDate_C?.value);
        const endDate = new Date(endDate_C?.value);
        

        if (startDate >= endDate) {
          // startDate_C.setErrors({ endDateLessThanStartDate: true });
          endDate_C.setErrors({ endDateLessThanStartDate: message });
          
          // return { endDateLessThanStartDate: true}
        } else {
          // startDate_C.setErrors(null);
          endDate_C.setErrors(null);
          return null;
        }
      }

      return null;
    };
  }
  static validateHtmlContent(control: FormControl) {
    const value = control.value;
    const parser = new DOMParser();
    try {
      const doc = parser.parseFromString(value, 'text/html');
      if (doc.documentElement.nodeName === 'HTML' && doc.documentElement.childNodes.length !== 0) {
        // Valid HTML content
        return null;
      } else {
        // Invalid HTML content
        return { invalid_Html: {value :control.value}};
      }
    } catch (error) {
      // Parsing error (invalid HTML)
      return { invalid_Html: {value :control.value}};
    }
  }
  static customRequiredValidator(control: FormControl,basedOnControl: FormControl) {
    if (basedOnControl.value && basedOnControl.value) {
      return { required: true };
    } else {
      return null;
    }

  }
}


// import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";
// import moment from "moment";

// export const alpha: ValidatorFn = Validators.pattern('[a-zA-Z]*$');
// export const alphaAllowSpaces: ValidatorFn = Validators.pattern('[a-zA-Z ]*$');
// export const alphaAllowSpacesAndSplash: ValidatorFn = Validators.pattern('[a-zA-Z /]*$');
// export const alphaNumeric: ValidatorFn = Validators.pattern('[a-zA-Z0-9]*$');
// export const alphaNumericAllowSpaces: ValidatorFn = Validators.pattern('[a-zA-Z0-9 ]*$');
// export const alphaNumericAllowDash: ValidatorFn = Validators.pattern('[a-zA-Z0-9-]*$');
// export const numericAllowDash: ValidatorFn = Validators.pattern('[0-9-]*$');
// export const numeric: ValidatorFn = Validators.pattern('[0-9]*$');
// export const currency: ValidatorFn = Validators.pattern('[0-9,]*$');
// export const addressLine: ValidatorFn = Validators.pattern('(([0-9]{1,}).(.*[a-zA-Z#/&]){2,}$)|(([RRHC]{2,}).[0-9]{1,})|(([0-9]{1,}).(.*[a-zA-Z#/&]){2,}.(.*[0-9#])$)');
// export const date: ValidatorFn = Validators.pattern('((0|1)d{1})((0|1|2|3)d{1})((19|20)d{2})');

// export const previousDateOnly: ValidatorFn = (control: AbstractControl) =>
//         moment(control?.value).isSameOrAfter(new Date(), 'day')
//             ? { date: 'The date entered must be before today'}
//             : null;

//     export const leapYearNotAllowed: ValidatorFn = (control: AbstractControl) =>
//         control?.value?.length === 8 &&
//         control?.value?.substr(0, 2) === '02' &&
//         control?.value?.substr(2, 2) === '29' &&
//         moment([control?.value?.substr(2, 4)]).isLeapYear()
//             ? { date: 'Leap Year Is Not Allowed' }
//             : null;