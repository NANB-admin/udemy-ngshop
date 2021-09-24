import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { environment } from '@env/environment';
import { environment } from '../../../../../environments/environment';
import { User } from '../models/user.model';
import * as countriesLibrary from 'i18n-iso-countries';
import { UsersFacade } from '../state/users.facade';

declare const require;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiURLUsers = environment.apiURL + 'users';

  constructor(private http: HttpClient, private usersFacade: UsersFacade) {
    countriesLibrary.registerLocale(require("i18n-iso-countries/langs/en.json"));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUsers}/${userId}`);
  }

  getCountryFromCode(countryCode: string): string {
    return countriesLibrary.getName(countryCode, "en", { select: "official" });
  }

  getTotalUsers(): Observable<number> {
    return this.http.get<number>(`${this.apiURLUsers}/get/count`).pipe(map((result: any) => {
      return result.userCount;
    }));
  }


  getCountries(): { id: string, name: string }[] {

    return Object.entries(countriesLibrary.getNames("en", { select: "official" })).map(entry => {
      // console.log(entry);
      return {
        id: entry[0],
        name: entry[1]
      };
    });
    // console.log(this.countries);
  }

  initAppSession() {
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser() {
    return this.usersFacade.currentUser$;
  }

  isCurrentUserAuthenticated() {
    this.usersFacade.isAuthenticated$;
  }

}
