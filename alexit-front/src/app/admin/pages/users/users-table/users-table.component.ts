import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '../../../../../models/role.model';
import { User } from '../../../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserSearchPipe } from '../../../../pipes/user-search.pipe';
import { RoleFilterPipe } from '../../../../pipes/role-filter.pipe';
import { AlexitService } from '../../../../services/alexit.service';

@Component({
  selector: 'users-table',
  standalone: true,
  imports: [FormsModule, RouterLink, UserSearchPipe, RoleFilterPipe],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit {

  @Output() onUserDelete = new EventEmitter<{ id: string }>()

  users: User[] = [];

  roles: Role[] = [];

  filterRole: string = '';

  filterSearch: string = '';




  constructor(private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.users$.subscribe({ next: (val) => this.users = val, error: (err) => console.log(err) });
    this.alexit.roles$.subscribe({ next: (val) => this.roles = val, error: (err) => console.log(err) });
  }




  delete(id: string) {
    this.alexit.deleteUser(id);
  }

}
