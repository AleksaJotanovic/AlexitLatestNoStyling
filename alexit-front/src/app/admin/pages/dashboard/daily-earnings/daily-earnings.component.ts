import { Component, Input } from '@angular/core';

@Component({
  selector: 'daily-earnings',
  standalone: true,
  imports: [],
  templateUrl: './daily-earnings.component.html',
  styleUrl: './daily-earnings.component.css'
})
export class DailyEarningsComponent {
  @Input() dailyEarnings!: string;
}
