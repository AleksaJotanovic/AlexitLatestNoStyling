import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user.model';

@Pipe({
  name: 'userSearch',
  standalone: true
})
export class UserSearchPipe implements PipeTransform {

  transform(value: User[], input: string): any {
    if (input) {
      return value.filter((val) => (val.username + val.firstname + val.lastname + val.email + val.role.name).toLowerCase().indexOf(input.toLowerCase()) >= 0);
    } else {
      return value;
    }
  }



}
