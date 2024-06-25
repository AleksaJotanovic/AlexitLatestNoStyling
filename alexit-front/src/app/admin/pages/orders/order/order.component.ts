import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../../models/order.model';
import { Product } from '../../../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlexitService } from '../../../../services/alexit.service';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ItemsComponent } from './items/items.component';
import { AccountingComponent } from './accounting/accounting.component';
import { FormGroup } from '@angular/forms';
import { CrudService } from '../../../../services/crud.service';
import { accountingMail, orderStatusMail } from '../../../../../middlewares/htmls';
import { countVat } from '../../../../../middlewares/library';

@Component({
  selector: 'order',
  standalone: true,
  imports: [OrderDetailsComponent, ItemsComponent, AccountingComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  order!: Order;

  products!: Product[];

  orders!: Order[];

  orderStatusList!: { id: number, value: string }[];

  cashier: any = '';



  constructor(private route: ActivatedRoute, private alexit: AlexitService, private router: Router, private crud: CrudService) { }

  ngOnInit(): void {
    this.alexit.orders$.subscribe({
      next: (val) => {
        const order = val.find((v) => v._id === this.route.snapshot.params['id']);
        if (order !== undefined) {
          this.order = order;
        };
        this.orders = val;
      }, error: (err) => console.log(err)
    });
    this.orderStatusList = this.alexit.orderStatusList;
    this.alexit.products$.subscribe({ next: (val) => this.products = val, error: (err) => console.log(err) });
    this.crud.userGet(String(localStorage.getItem('user_id'))).subscribe(u => this.cashier = u.data.username);
  }

  getAccountingMail() {
    let orderItems = [];
    for (let item of this.order.items) {
      const product = this.products.find(p => p._id === item.product_id);
      if (product !== undefined) {
        orderItems.push({
          name: item.name,
          uom: product.uom,
          quantity: item.quantity,
          priceByUom: product.price.regular,
          taxBase: item.quantity * product.price.regular,
          vatRate: 20,
          vatAmount: Math.round((20 / 100) * (item.quantity * product.price.regular)),
          totalPayment: item.price
        });
      }
    }
    return accountingMail(orderItems, this.order, this.orders, this.cashier);
  }



  update(event: { updateForm: FormGroup, statusChanged: boolean }) {
    const updateObj: Order = {
      ...this.order,
      paid: event.updateForm.value.isPaid,
      status: event.updateForm.value.orderStatus
    }
    const mailObj = {
      ...updateObj,
      orderStatusMail: orderStatusMail(event.updateForm.value.orderStatusMessage, this.order)
    };

    const match = this.alexit.orderStatusList.find(o => o.id === 1);
    if (event.statusChanged === true && event.updateForm.value.orderStatus !== match?.value) {
      this.alexit.updateOrder(updateObj);
      this.alexit.mailOrderStatus(mailObj);
      this.router.navigate(["admin/orders"]);
    } else {
      this.alexit.updateOrder(updateObj);
      this.router.navigate(["admin/orders"]);
    }

  }

  sendAccountingPdf() {
    this.alexit.sendAccounting(this.order._id, this.getAccountingMail());
    this.alexit.updateOrder({ ...this.order, accountingSent: true });
  }
  viewAccountingPdf() {
    let x = window.open();
    x?.document.open();
    x?.document.write(this.getAccountingMail());
  }

  generateSale() {
    for (let item of this.order.items) {
      let prod = this.products.find(p => p._id === item.product_id);
      if (prod !== undefined) {
        this.alexit.addSale({
          group: prod.category,
          uom: prod.uom,
          articleCode: prod.sku,
          articleName: prod.name,
          quantity: item.quantity,
          purchasePrice: prod.price.purchase,
          margin: prod.price.margin,
          pricePerUom: prod.price.regular,
          taxBase: Math.round(prod.price.regular * item.quantity),
          vatRate: 20,
          vat: countVat(Math.round(prod.price.regular * item.quantity)),
          saleValue: item.price,
          earned: Math.round(item.quantity * prod.price.earning),
          createdAt: String(new Date()),
        });
      }
    };
    this.alexit.updateOrder({ ...this.order, saleGenerated: true });
  }


}
// ☺
