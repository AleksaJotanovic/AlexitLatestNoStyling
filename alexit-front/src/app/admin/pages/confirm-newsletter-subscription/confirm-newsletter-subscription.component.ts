import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlexitService } from '../../../services/alexit.service';

@Component({
  selector: 'confirm-newsletter-subscription',
  standalone: true,
  imports: [],
  templateUrl: './confirm-newsletter-subscription.component.html',
  styleUrl: './confirm-newsletter-subscription.component.css'
})
export class ConfirmNewsletterSubscriptionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private alexit: AlexitService) { }
  ngOnInit(): void {
    this.route.params.subscribe(p => {
      const token: any = jwtDecode(p['token'].replace('-', '.').replace('-', '.'));
      this.alexit.addSubscriber(token.email)
    });
  }

}
