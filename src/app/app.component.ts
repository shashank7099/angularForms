import {
  Component,
  OnInit
} from '@angular/core';
// Import FormGroup and FormControl classes
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // This FormGroup contains fullName and Email form controls
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder) {}


  // Group properties on the formErrors object. The UI will bind to these properties
  // to display the respective validation messages
  formErrors = {
    // 'fullName': '',
    // 'email': '',
    // 'confirmEmail': '',
    // 'emailGroup': '',
    // 'phone': '',
    // 'skillName': '',
    // 'experienceInYears': '',
    // 'proficiency': ''
  };

  // This structure stoes all the validation messages for the form Include validation
  // messages for confirmEmail and emailGroup properties. Notice to store the
  // validation message for the emailGroup we are using emailGroup key. This is the
  // same key that the matchEmails() validation function below returns, if the email
  // and confirm email do not match.
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be less than 10 characters.',
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domian should be dell.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match.'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    // 'skillName': {
    //   'required': 'Skill Name is required.',
    // },
    // 'experienceInYears': {
    //   'required': 'Experience is required.',
    // },
    // 'proficiency': {
    //   'required': 'Proficiency is required.',
    // },
  };

  // Initialise the FormGroup with the 2 FormControls we need.
  // ngOnInit ensures the FormGroup and it's form controls are
  // created when the component is initialised
  ngOnInit() {
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, this.emailDomain('dell.com')]],
        confirmEmail: ['', [Validators.required]],
      }, {
        validator: this.matchEmails
      }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    //Form array example
    const formArray = new FormArray([
      new FormControl('John', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required)
      }),
      new FormArray([])
    ]);

    for (const control of formArray.controls) {
      if (control instanceof FormControl) {
        console.log('control is FormControl');
      }
      if (control instanceof FormGroup) {
        console.log('control is FormGroup');
      }
      if (control instanceof FormArray) {
        console.log('control is FormArray');
      }
    }

    // Subscribe to valueChanges observable
    this.employeeForm.get('fullName').valueChanges.subscribe(
      value => {
        console.log(value);
      }
    );

    // When any of the form control value in employee form changes
    // our validation function logValidationErrors() is called
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    // Subscribe to FormGroup valueChanges observable
    this.employeeForm.valueChanges.subscribe(
      value => {
        console.log(JSON.stringify(value));
      }
    );
  }


  onSubmit(): void {
    console.log(this.employeeForm.value);
  }


  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }

  onLoadDataClick(): void {
    // this.employeeForm.setValue({
    //   fullName: 'Pragim Technologies',
    //   email: 'pragim@pragimtech.com',
    //   skills: {
    //     skillName: 'C#',
    //     experienceInYears: 5,
    //     proficiency: 'beginner'
    //   }
    // });
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

  // logValidationErrors(group: FormGroup = this.employeeForm): void {
  //   // Loop through each control key in the FormGroup
  //   Object.keys(group.controls).forEach((key: string) => {
  //     // Get the control. The control can be a nested form group
  //     const abstractControl = group.get(key);
  //     // If the control is nested form group, recursively call
  //     // this same method
  //     if (abstractControl instanceof FormGroup) {
  //       this.logValidationErrors(abstractControl);
  //       // If the control is a FormControl
  //     } else {
  //       // Clear the existing validation errors
  //       this.formErrors[key] = '';
  //       if (abstractControl && !abstractControl.valid) {
  //         // Get all the validation messages of the form control
  //         // that has failed the validation
  //         const messages = this.validationMessages[key];
  //         // Find which validation has failed. For example required,
  //         // minlength or maxlength. Store that error message in the
  //         // formErrors object. The UI will bind to this object to
  //         // display the validation errors
  //         for (const errorKey in abstractControl.errors) {
  //           if (errorKey) {
  //             this.formErrors[key] += messages[errorKey] + ' ';
  //           }
  //         }
  //       }
  //     }
  //   });
  // }
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      // Loop through nested form groups and form controls to check
      // for validation errors. For the form groups and form controls
      // that have failed validation, retrieve the corresponding
      // validation message from validationMessages object and store
      // it in the formErrors object. The UI binds to the formErrors
      // object properties to display the validation errors.
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
      // We need this additional check to get to the FormGroup
      // in the FormArray and then recursively call this
      // logValidationErrors() method to fix the broken validation
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls) {
      //     if (control instanceof FormGroup) {
      //       this.logValidationErrors(control);
      //     }
      //   }
      // }
    });
  }

  emailDomain(domainName: string) {
    return (control: AbstractControl): {
      [key: string]: any
    } | null => {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);
      if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      } else {
        return {
          'emailDomain': true
        };
      }
    };
  }

  // Nested form group (emailGroup) is passed as a parameter. Retrieve email and
  // confirmEmail form controls. If the values are equal return null to indicate
  // validation passed otherwise an object with emailMismatch key. Please note we
  // used this same key in the validationMessages object against emailGroup
  // property to store the corresponding validation error message
  matchEmails(group: AbstractControl): {
    [key: string]: any
  } | null {
    const emailControl = group.get('email');
    const confirmEmailControl = group.get('confirmEmail');

    if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine) {
      return null;
    } else {
      return {
        'emailMismatch': true
      };
    }
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    (<FormArray>this.employeeForm.get('skills')).removeAt(skillGroupIndex);
  }

}
