import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../admin/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'client-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.css'
})
export class ClientFooterComponent {


  email: string = ''


  constructor(private auth: AuthService) { }


  subscribeToNewsletter() {
    this.auth.confirmNewsletterSubscription(this.email).subscribe({ next: v => console.log(v), error: e => console.log(e) });
  }

}
