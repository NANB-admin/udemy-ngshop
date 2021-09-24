import { Component, OnInit } from '@angular/core';
import { UsersService } from '@angular/users';

@Component({
  selector: 'ngshop-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'ngshop';

  constructor(private userService: UsersService) {

  }

  ngOnInit() {
    this.userService.initAppSession();
  }
}
