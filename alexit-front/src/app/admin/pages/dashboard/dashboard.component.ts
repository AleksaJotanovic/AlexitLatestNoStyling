import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../services/alexit.service';
import { LatestOrdersComponent } from './latest-orders/latest-orders.component';
import { Order } from '../../../../models/order.model';
import { YearlySalaryComponent } from './yearly-salary/yearly-salary.component';
import { MonthlySalaryComponent } from './monthly-salary/monthly-salary.component';
import { WeeklyEarningsComponent } from './weekly-earnings/weekly-earnings.component';
import { DailyEarningsComponent } from './daily-earnings/daily-earnings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PageViewsComponent } from './page-views/page-views.component';
import { TotalCustomersComponent } from './total-customers/total-customers.component';
import { TotalEarningsComponent } from './total-earnings/total-earnings.component';
import { Sale } from '../../../../models/sale.model';
import { groupByMonth, groupByWeeks, groupByYear, money, sum } from '../../../../middlewares/library';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    LatestOrdersComponent,
    YearlySalaryComponent,
    MonthlySalaryComponent,
    WeeklyEarningsComponent,
    DailyEarningsComponent,
    StatisticsComponent,
    PageViewsComponent,
    TotalCustomersComponent,
    TotalEarningsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  orders: Order[] = [];
  sales: Sale[] = [];

  totalEarnings: string = '';
  yearlySalary: string = '';
  monthlySalary: string = '';
  weeklyEarnings: string = '';
  dailyEarnings: string = '';
  statistics: { month: string; total: number }[] = [];
  pageViews: number = 0;
  totalCustomers: number = 0;



  constructor(private alexit: AlexitService) { }

  ngOnInit(): void {
    this.alexit.orders$.subscribe({
      next: v => {
        const value = v.filter(o => new Date(o.creationTime).toLocaleDateString() === new Date().toLocaleDateString());
        this.orders = value.sort((a, b) => new Date(b.creationTime).valueOf() - new Date(a.creationTime).valueOf());
      }, error: e => console.log(e)
    });
    this.alexit.sales$.subscribe({
      next: v => {
        this.sales = v.sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
        if (this.sales.length !== 0) {
          this.totalEarnings = money(sum(this.sales, 'earned'));
          this.countYearlySalary();
          this.countMonthlySalary();
          this.countWeeklyEarnings();
          this.countDailyEarnings();
          this.countStatistics(new Date(this.sales[this.sales.length - 1].createdAt).getFullYear());
        };
      }, error: e => console.log(e)
    });
    this.alexit.pageViews$.subscribe({ next: v => this.pageViews = v });
    this.alexit.users$.subscribe({ next: v => this.totalCustomers = v.filter(u => u.role.name === 'Customer').length });
  };



  countYearlySalary() {
    const years = groupByYear(this.sales);
    const value = sum(years, 'total');
    this.yearlySalary = money(value / years.length);
  };
  countMonthlySalary() {
    const months = groupByMonth(this.sales);
    const value = sum(months, 'total');
    this.monthlySalary = money(value / months.length);
  };
  countWeeklyEarnings() {
    const weeks = groupByWeeks(this.sales);
    const value = sum(weeks, 'total');
    this.weeklyEarnings = money(value / weeks.length);
  };
  countDailyEarnings() {
    const value = sum(this.sales, 'earned');
    this.dailyEarnings = money(value / this.sales.length);
  };
  countStatistics(year: number) {
    const byYear = this.sales.filter(i => new Date(i.createdAt).getFullYear() === year);
    const byMonth = groupByMonth(byYear);

    let statisticsArray = [];
    for (let sale of byMonth) {
      statisticsArray.push({ month: new Date(sale.monthYear).toLocaleDateString('en-US', { month: 'short' }), total: sale.total });
    };
    this.statistics = statisticsArray;
  };

  filterByYear(e: { yearFilter: number }) {
    this.countStatistics(e.yearFilter);
  }

}
