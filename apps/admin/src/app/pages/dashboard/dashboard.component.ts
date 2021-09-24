import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@angular/orders';
import { ProductsService } from '@angular/products';
import { UsersService } from '@angular/users';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  statistics = [];

  constructor(private usersService: UsersService, private ordersService: OrdersService, private productService: ProductsService) { }

  endSubscriptions$: Subject<any> = new Subject();

  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  ngOnInit(): void {

    /*
    Note: combineLatest will make all service calls and combine the results into the this.statistics array
    */
    combineLatest([
      this.ordersService.getTotalOrders().pipe(takeUntil(this.endSubscriptions$)),
      this.productService.getProductCount().pipe(takeUntil(this.endSubscriptions$)),
      this.usersService.getTotalUsers().pipe(takeUntil(this.endSubscriptions$)),
      this.ordersService.getTotalSales().pipe(takeUntil(this.endSubscriptions$)),
    ]).subscribe((values) => {
      this.statistics = values
      // console.log(this.statistics[0]);
      // console.log(this.statistics[1]);
      // console.log(this.statistics[2]);
      // console.log(this.statistics[3]);
    });
  }

}
