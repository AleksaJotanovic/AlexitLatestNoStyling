import { Component, Input } from '@angular/core';

@Component({
  selector: 'weekly-earnings',
  standalone: true,
  imports: [],
  templateUrl: './weekly-earnings.component.html',
  styleUrl: './weekly-earnings.component.css'
})
export class WeeklyEarningsComponent {
  @Input() weeklyEarnings!: string;
}
