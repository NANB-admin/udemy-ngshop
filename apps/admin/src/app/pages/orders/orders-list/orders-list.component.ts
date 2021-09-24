import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order, OrdersService, ORDER_STATUS } from '@angular/orders';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  orderStatus = ORDER_STATUS;

  constructor(private ordersService: OrdersService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) { }

  endSubscriptions$: Subject<any> = new Subject();
  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  ngOnInit(): void {
    this._getOrders();
  }

  private _getOrders() {
    this.ordersService.getOrders().pipe(takeUntil(this.endSubscriptions$)).subscribe(orders => {
      this.orders = orders;
    });
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this order - ${orderId}?`,
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId).pipe(takeUntil(this.endSubscriptions$)).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order has been deleted.' });
          this._getOrders();
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order was not deleted.' });
            // console.log(error);
          });
      }
    });
  }

  showOrder(orderId: string) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

}
