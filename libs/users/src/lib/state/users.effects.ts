import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';

import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {

  buildUserSession$ = createEffect(() => this.actions$.pipe(
    ofType(UsersActions.buildUserSession),
    concatMap(() => {
      if (this.localStorageService.isValidToken()) {
        const userId = this.localStorageService.getUserIdFromToken();
        if (userId) {
          return this.usersService.getUserById(userId).pipe(map((user) => {
            return UsersActions.buildUserSessionSuccess({ user: user });
          }),
            catchError(() => of(UsersActions.buildUserSessionFailed()))
          )
        }
        else {
          return of(UsersActions.buildUserSessionFailed());
        }
      }
      else {
        return of(UsersActions.buildUserSessionFailed());
      }
    })
  ));

  constructor(private readonly actions$: Actions, private localStorageService: LocalStorageService, private usersService: UsersService) { }
}
