import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order, OrderItem, OrdersService, ORDER_STATUS } from '@angular/orders';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit, OnDestroy {

  order: Order;
  orderItems: OrderItem[] = [];
  orderStatuses = [];
  selectedStatus: any;
  endSubscriptions$: Subject<any> = new Subject();


  constructor(private orderService: OrdersService, private activatedRoute: ActivatedRoute, private messageService: MessageService) { }
  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  ngOnInit(): void {
    this._getOrder();
    this._mapOrderStatus();
    // console.log(this.selectedStatus);
  }


  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      };
    });
    // console.log(this.orderStatuses);
  }

  private _getOrder() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.orderService.getOrderById(params.id).pipe(takeUntil(this.endSubscriptions$)).subscribe((order) => {
          this.order = order;
          // this.selectedStatus = ORDER_STATUS[order.status].label;
          this.selectedStatus = order.status
          // console.log(this.selectedStatus);
          if (order.orderItems) {
            this.orderItems = order.orderItems;
          }
        });

      }
    })
  }

  onStatusChange(event) {
    this.orderService.updateOrder({ status: event.value }, this.order.id).pipe(takeUntil(this.endSubscriptions$)).subscribe(order => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Order ${order.id} has been updated.` });
    }, (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Order was not updated!'
      })
      console.log(error);
    })
  }
}
