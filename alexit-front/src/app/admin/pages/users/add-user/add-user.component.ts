import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../../services/alexit.service';
import { FormGroup } from '@angular/forms';
import { Role } from '../../../../../models/role.model';
import { User } from '../../../../../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { AddUserFormComponent } from './add-user-form/add-user-form.component';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [AddUserFormComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {

  roles: Role[] = [];



  constructor(private alexit: AlexitService) { };

  ngOnInit(): void {
    this.alexit.roles$.subscribe((val) => this.roles = val);
  };



  save(event: { userForm: FormGroup }) {
    const roleFilter = this.roles.find((role) => role._id === event.userForm.get('role_id')?.value);

    const userBody: User = {
      ...event.userForm.value,
      _id: uuidv4(),
      role: { _id: roleFilter?._id, name: roleFilter?.name }
    };
    this.alexit.addUser(userBody);
    event.userForm.reset();
  };

}
