import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user.model';

@Pipe({
  name: 'roleFilter',
  standalone: true
})
export class RoleFilterPipe implements PipeTransform {

  transform(value: User[], input: string): User[] {
    if (input) {
      return value.filter((val) => val.role.name === input);
    } else {
      return value;
    }
  }

}
