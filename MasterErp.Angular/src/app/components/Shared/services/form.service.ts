import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  // get all values of the formGroup, loop over them
  // then mark each field as touched
  public markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      // if (control.controls) {
      //     control.controls.forEach(c => this.markFormGroupTouched(c));
      // }
    });
  }

  // return list of error messages
  public validationMessages() {
    const messages = {
      required: 'Required',
      email: 'Invalid Email',
      pattern:'Invalid Pattern',
      min:'Invalid Number , Enter greater than this',
      invalid_URL:'Invalid URL',
      invalid_Html:'Invalid HTML',
      //endDateLessThanStartDate:'End Date Must Be Greater Than Start Date',
      endDateLessThanStartDate: (error: string) =>  error || 'End Date Must Be Greater Than Start Date',
      regexPattern: (error: string) => error || 'Invalid pattern',
      dateGreaterThan: (error: string) => error || 'Date must be greater than the specific date',
      dateLessThan: (error: string) => error || 'Date must be less than the specific date',
      
      // invalidExtension:'Invalid Extension , choose from jpg,jpeg,png',
      invalidExtension: (matches: any[]) => {

        let matchedCharacters = matches;

        matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
          let string = characterString;
          string += character;

          if (matchedCharacters.length !== index + 1) {
            string += ', ';
          }

          return string;
        }, '');

        return `Invalid Invalid Extension , choose from ${matchedCharacters}`;
      },
      invalid_characters: (matches: any[]) => {

        let matchedCharacters = matches;

        matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
          let string = characterString;
          string += character;

          if (matchedCharacters.length !== index + 1) {
            string += ', ';
          }

          return string;
        }, '');

        return `Invalid ${matchedCharacters}`;
      },
    };

    return messages;
  }

  // Validate form instance
  // check_dirty true will only emit errors if the field is touched
  // check_dirty false will check all fields independent of
  // being touched or not. Use this as the last check before submitting
  public validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean) {
    const form = formToValidate;

    for (const field in formErrors) {
      if (field) {
        formErrors[field] = '';
        const control = form.get(field);

        const messages = this.validationMessages();
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              
              if (key && !['invalid_characters','invalidExtension','endDateLessThanStartDate','regexPattern','dateGreaterThan','dateLessThan'].includes(key)) {
                formErrors[field] = formErrors[field] || messages[key];
              }
              else {
                formErrors[field] = formErrors[field] || messages[key](control.errors[key]);
              }
            }
          }
        }
      }
    }

    return formErrors;
  }
}
