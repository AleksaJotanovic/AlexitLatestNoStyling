import { Component, Input } from '@angular/core';

@Component({
  selector: 'total-earnings',
  standalone: true,
  imports: [],
  templateUrl: './total-earnings.component.html',
  styleUrl: './total-earnings.component.css'
})
export class TotalEarningsComponent {

  @Input() totalEarnings!: string;

}
