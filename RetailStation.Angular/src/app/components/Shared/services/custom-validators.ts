import { HttpClient } from "@angular/common/http";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Subscription, catchError, map, of } from "rxjs";

const validCharacters = /[^\s\w,.:&\/()+%'`@-]/;
const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

export class CustomValidators extends Validators {


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
      return isValid ? null : { invalid_URL: { value: control.value } };
    } else {
      return null;
    }
  }

  static extensionValidator(allowedExtensions: string[] = ['jpg', 'jpeg', 'png']) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        const fileExtension = control.value.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          return { invalidExtension: allowedExtensions };
        }

      }
      return null;
    };

  }
  static imageDimensionValidator(maxWidth: number, maxHeight: number) {
    return (control: AbstractControl): Promise<{ [key: string]: any } | null> | null => {
      const file = control.value;
      // ✅ Skip if no file or not a File object
      if (!(file instanceof File)) return Promise.resolve(null);

      return new Promise((resolve) => {
        const reader = new FileReader();
        const img = new Image();

        reader.onload = (event: any) => {
          img.src = event.target.result;
          img.onload = () => {
            if (img.width > maxWidth || img.height > maxHeight) {
              resolve({
                invalidDimensions: {
                  actualWidth: img.width,
                  actualHeight: img.height,
                  maxWidth,
                  maxHeight,
                },
              });
            } else {
              resolve(null);
            }
          };
          img.onerror = () => resolve({ invalidDimensions: true });
        };

        reader.readAsDataURL(file);
      });
    };
  }


  static endDateGreaterThanStartDate(startDateCName: string, endDateCName: string, message = null): ValidatorFn {
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

  static arrayLengthValidator(minLength: number, maxLength?: number, message = null): ValidatorFn {
    return (control: AbstractControl) => {

      const value = control.value;

      if (control.value) {
        if (!Array.isArray(value)) {
          return { arrayLength: { message: 'Value is not an array' } };
        }

        if (maxLength !== undefined) {
          if (value.length < minLength || value.length > maxLength) {
            // return { arrayLength: { requiredLength: minLength, actualLength: value.length } };
            return { arrayLength: message };
          }
        } else {
          if (value.length < minLength) {
            // return { arrayLength: { requiredLength: minLength, actualLength: value.length } };
            return { arrayLength: message };
          }
        }

        return null;  // Valid



      }
      return null;
    };
  }
  static dateGreaterThan(specificDate: Date, message: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        const inputDate = new Date(control.value);
        specificDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        if (inputDate <= specificDate) {
          return { dateGreaterThan: message };
        }
      }
      return null;
    };
  }

  static dateLessThan(specificDate: Date, message: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        const inputDate = new Date(control.value);
        specificDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        if (inputDate >= specificDate) {
          return { dateLessThan: message };
        }
      }
      return null;
    };
  }
  static regexPattern(type: RegexType, message: string = null): ValidatorFn {
    const regex = regexList.find(x => x.type === type);
    if (!regex) {
      return (control: AbstractControl) => null;  // Return a validator that always passes if no regex is found
    }

    return (control: AbstractControl) => {
      if (control.value && !regex.pattern.test(control.value)) {
        return { regexPattern: message ? message : regex.message };
      }
      return null;  // Return null if validation passes
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
        return { invalid_Html: { value: control.value } };
      }
    } catch (error) {
      // Parsing error (invalid HTML)
      return { invalid_Html: { value: control.value } };
    }
  }
  static customRequiredValidator(control: FormControl, basedOnControl: FormControl) {
    if (basedOnControl.value && basedOnControl.value) {
      return { required: true };
    } else {
      return null;
    }

  }
  static discountValueLimitCheck(valueTypeCName: string, discountValueCName: string, limit: number = 50, message = null): ValidatorFn {
    return (formGroup: AbstractControl) => {
      // Cast to FormGroup to ensure .get() is available, though AbstractControl has it
      const group = formGroup as FormGroup;

      const valueType_C = group.get(valueTypeCName);
      const discountValue_C = group.get(discountValueCName);

      // Ensure both controls exist and have values
      if (valueType_C?.value && discountValue_C?.value) {
        const valueType = valueType_C.value;
        const discountValue = parseFloat(discountValue_C.value);

        // Check if the type is 'PERCENT' and the value exceeds the limit
        if (valueType === 'PERCENT') {
          if (discountValue > limit) {
            // Set error on the discountValue control
            discountValue_C.setErrors({ percentageLimitExceeded: message });
            return { percentageLimitExceeded: true }; // Return error at group level too (optional but common)
          }
        }
      }

      // If the condition is not met (not 'PERCENT' or no values), 
      // ensure the error is cleared if it was previously set by this validator
      if (discountValue_C?.hasError('percentageLimitExceeded')) {
        discountValue_C.setErrors(null);
        // Re-run other validators if needed (optional)
      }

      return null;
    };
  }

  
}

export interface RegexModel {
  pattern: RegExp;
  message: string;
  type: RegexType;
}
export enum RegexType {
  text = 1,
  email,
  url,
  number,
  date,
  alpha,
  alphaAllowSpaces,
  alphaAllowSpacesAndSplash,
  alphaNumeric,
  alphaNumericAllowSpaces,
  alphaNumericAllowDash,
  numericAllowDash,
  numeric,
  currency,
  addressLine,
  phoneNumber

}
export const regexList: RegexModel[] = [
  {
    //pattern: /^[0-9]+(\.[0-9])?$/, // Matches only numbers with points
    pattern: /^[0-9]+(\.[0-9]+)?$/, // Matches only numbers with points
    message: "ادخل ارقام فقط",
    type: RegexType.number
  },
  {
    pattern: /^[a-zA-Z]+$/, // Matches only letters
    message: "Only alphabetic characters are allowed.",
    type: RegexType.alpha
  },
  {
    pattern: /^[a-zA-Z\s]+$/, // Matches letters and spaces
    message: "Only alphabetic characters and spaces are allowed.",
    type: RegexType.alphaAllowSpaces
  },
  {
    pattern: /^[a-zA-Z\s/]+$/, // Matches letters, spaces, and slashes
    message: "Only alphabetic characters, spaces, and slashes are allowed.",
    type: RegexType.alphaAllowSpacesAndSplash
  },
  {
    pattern: /^[a-zA-Z0-9]+$/, // Matches alphanumeric characters
    message: "Only alphanumeric characters are allowed.",
    type: RegexType.alphaNumeric
  },
  {
    pattern: /^[a-zA-Z0-9\s]+$/, // Matches alphanumeric characters and spaces
    message: "Only alphanumeric characters and spaces are allowed.",
    type: RegexType.alphaNumericAllowSpaces
  },
  {
    pattern: /^[a-zA-Z0-9-]+$/, // Matches alphanumeric characters and dashes
    message: "Only alphanumeric characters and dashes are allowed.",
    type: RegexType.alphaNumericAllowDash
  },
  {
    pattern: /^\d+$/, // Matches only numeric characters
    message: "Only numeric characters are allowed.",
    type: RegexType.numeric
  },
  {
    pattern: /^[0-9-]+$/, // Matches numeric characters and dashes
    message: "Only numeric characters and dashes are allowed.",
    type: RegexType.numericAllowDash
  },
  {
    pattern: /^\d+(\.\d{1,2})?$/, // Matches currency (e.g., 123.45)
    message: "Only numeric values with up to 2 decimal places are allowed.",
    type: RegexType.currency
  },
  {
    pattern: /^[\w\s,-]+$/, // Matches common address line patterns
    message: "Only letters, numbers, spaces, commas, and dashes are allowed.",
    type: RegexType.addressLine
  },
  {
    pattern: /^\d{4}-\d{2}-\d{2}$/, // Matches date in YYYY-MM-DD format
    message: "Date must be in YYYY-MM-DD format.",
    type: RegexType.date
  },
  {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Matches standard email format
    message: "Please enter a valid email address.",
    type: RegexType.email
  },
  {
    pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, // Matches standard URL format
    message: "Please enter a valid URL.",
    type: RegexType.url
  },
  {
    pattern: /^[a-zA-Z\s]+$/, // Matches only text (letters and spaces)
    message: "Only text characters are allowed.",
    type: RegexType.text
  },
   {
    pattern: /^[0-9+]+$/, // Matches only numbers
    message: "Only numbers and + are allowed.",
    type: RegexType.phoneNumber
  },
];

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