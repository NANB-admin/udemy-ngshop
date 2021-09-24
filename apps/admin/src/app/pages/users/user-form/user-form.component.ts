import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { User, UsersService } from '@angular/users';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-user-form',
  templateUrl: './user-form.component.html',
  styles: [
  ]
})
export class UserFormComponent implements OnInit, OnDestroy {
  isSubmitted = false;
  editMode = false;
  form: FormGroup
  countries: any = [];
  currentUserId: string;
  endSubscriptions$: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder, private usersService: UsersService, private messageService: MessageService, private location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  ngOnInit(): void {
    this._initUserForm();
    this._checkEditMode();
    this._getCountries();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    const user: User = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      password: this.userForm.password.value,
      email: this.userForm.email.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      city: this.userForm.city.value,
      state: this.userForm.state.value,
      country: this.userForm.country.value,
      zip: this.userForm.zip.value,
    }

    if (this.editMode) {
      this._updateUser(user);
    }
    else {
      this._addUser(user);
    }

  }


  onCancel() {
    this.location.back();
  }

  get userForm() {
    return this.form.controls;
  }

  private _initUserForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      state: [''],
      country: [''],
      isAdmin: [false]
    });
  }


  private _checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.usersService.getUserById(params.id).pipe(takeUntil(this.endSubscriptions$)).subscribe(user => {
          this.currentUserId = params.id;
          this.userForm.name.setValue(user.name);
          this.userForm.email.setValue(user.email);
          this.userForm.phone.setValue(user.phone);
          this.userForm.street.setValue(user.street);
          this.userForm.apartment.setValue(user.apartment);
          this.userForm.zip.setValue(user.zip);
          this.userForm.city.setValue(user.city);
          this.userForm.state.setValue(user.state);
          this.userForm.country.setValue(user.country);
          this.userForm.isAdmin.setValue(user.isAdmin);

          // this.userForm.password.setValue(user.password);
          this.userForm.password.setValidators([]);
          this.userForm.password.updateValueAndValidity();
        })
      }
    });
  }


  private _updateUser(user: User) {
    this.usersService.updateUser(user).pipe(takeUntil(this.endSubscriptions$)).subscribe((user: User) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${user.name} has been updated.` });

      /*
      Note: 1) Timer to add a 2sec delay for user to see toast notification
            2) location.back() redirects user back to their prev location in the app
      */
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User was not updated.' });
        console.log(error);
      });
  }


  private _addUser(user: User) {
    // console.log('1: ');
    // console.log(user);
    this.usersService.createUser(user).pipe(takeUntil(this.endSubscriptions$)).subscribe((user: User) => {
      // console.log('2: ');
      // console.log(user);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${user.name} has been created.` });

      /*
      Note: 1) Timer to add a 2sec delay for user to see toast notification
            2) location.back() redirects user back to their prev location in the app
      */
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User was not created.' });
        console.log(error);
      });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

}
