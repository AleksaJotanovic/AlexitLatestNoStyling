import { Component, Input } from '@angular/core';

@Component({
  selector: 'yearly-salary',
  standalone: true,
  imports: [],
  templateUrl: './yearly-salary.component.html',
  styleUrl: './yearly-salary.component.css'
})
export class YearlySalaryComponent {
  @Input() yearlySalary!: string;
}
