import { Component, Input } from '@angular/core';

@Component({
  selector: 'monthly-salary',
  standalone: true,
  imports: [],
  templateUrl: './monthly-salary.component.html',
  styleUrl: './monthly-salary.component.css'
})
export class MonthlySalaryComponent {
  @Input() monthlySalary!: string;
}
