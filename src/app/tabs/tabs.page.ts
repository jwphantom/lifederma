import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from '../models/order';
import { AuthenticationService } from '../services/authentication-service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  @Input() badge: number;

  orders = [];

  ordersSubscription: Subscription;



  constructor(public orderService: OrderService,
    private authService: AuthenticationService,

    ) { }

  ngOnInit() {
    this.storeOrder();
  }

  storeOrder() {

    const user = this.authService.getUser();

    this.orderService.getOrder()

    this.ordersSubscription = this.orderService.OrderSubject.subscribe(
      (orders: Order[]) => {
        this.orders = orders; 
        let cpt = 0;

        for (let i = 0; i < orders.length; i++) {
          if (!orders[i].view.some(item => item === user.email) && !orders[i].delivered) {
             cpt = cpt +1;
          }

          this.badge = cpt

        }        
      }
    );
    this.orderService.emitOrder();

  }


}
