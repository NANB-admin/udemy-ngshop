import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UsersService } from '@angular/users';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-user-list',
  templateUrl: './user-list.component.html',
  styles: [
  ]
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  endSubscriptions$: Subject<any> = new Subject();

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  ngOnInit(): void {
    this._getUsers();
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this user - ${userId}?`,
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).pipe(takeUntil(this.endSubscriptions$)).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User has been deleted.' });
          this._getUsers();
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User was not deleted.' });
            // console.log(error);
          });
      }
    });
  }
  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`)
  }

  private _getUsers() {
    this.usersService.getUsers().pipe(takeUntil(this.endSubscriptions$)).subscribe(users => {
      this.users = users;
    });
  }
  getCountryName(countryKey: string): string {
    if (countryKey) return this.usersService.getCountryFromCode(countryKey);
    else {
      return '';
    }
  }
}
