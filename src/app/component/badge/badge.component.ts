import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent implements OnInit {

  @Input() badge: number;

  orders = [];

  ordersSubscription: Subscription;



  constructor(public orderService: OrderService,
    private authService: AuthenticationService,

    ) { }

  ngOnInit() {
    this.storeOrder();
    this.badge = 1;

  }

  storeOrder() {

    const user = this.authService.getUser();

    this.orderService.getOrder()

    this.ordersSubscription = this.orderService.OrderSubject.subscribe(
      (orders: Order[]) => {
        this.orders = orders; 
        let cpt = 0;

        for (let i = 0; i < orders.length; i++) {
          if (!orders[i].view.some(item => item === user.email)) {
             cpt = cpt +1;
          }

          this.badge = cpt

        }        
      }
    );
    this.orderService.emitOrder();

  }


}
