import { Component, Input } from '@angular/core';

@Component({
  selector: 'total-customers',
  standalone: true,
  imports: [],
  templateUrl: './total-customers.component.html',
  styleUrl: './total-customers.component.css'
})
export class TotalCustomersComponent {
  @Input() totalCustomers!: number;

}
