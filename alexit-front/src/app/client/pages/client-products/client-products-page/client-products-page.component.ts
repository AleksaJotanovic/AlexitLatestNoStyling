import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../models/product.model';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductCardComponent } from './product-card/product-card.component';
import { CartService } from '../../../services/cart.service';
import { CrudService } from '../../../../services/crud.service';
import { User } from '../../../../../models/user.model';
import { FiltersComponent } from './filters/filters.component';
import { Category } from '../../../../../models/category.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'client-products-page',
  standalone: true,
  imports: [ProductCardComponent, FiltersComponent, NgIf, RouterLink],
  templateUrl: './client-products-page.component.html',
  styleUrl: './client-products-page.component.css'
})
export class ClientProductsPageComponent implements OnInit {

  products: Product[] = [];

  user!: User;

  category!: Category;



  constructor(private alexit: AlexitService, private route: ActivatedRoute, private cartService: CartService, private router: Router, private crud: CrudService) { }
  ngOnInit(): void {
    if (localStorage.getItem('customer_id')) {
      this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => this.user = v.data);
    }
    this.route.params.subscribe(v => this.alexit.products$.subscribe(prods => {
      this.alexit.categories$.subscribe((categories) => {
        const category = categories.find(c => c._id === v['categoryId']);
        if (category !== undefined) {
          this.category = category;
          this.filtering();
        }
      });
      this.products = prods.filter(p => p.category._id === v['categoryId']);
    }));
  }



  initProducts() {
    this.alexit.products$.subscribe({ next: prods => this.products = prods.filter(p => p.category._id === this.route.snapshot.params['categoryId']) });
  }

  addToCart(e: { product: Product }) {
    this.cartService.addToCart(e.product);
  }

  addToFavorites(e: { id: string }) {
    if (this.user) {
      if (!this.user.favoriteProducts.includes(e.id)) {
        this.user.favoriteProducts.push(e.id);
        this.alexit.updateUser(this.user);
      }
    } else {
      alert('You must be logged in to put product among favorites!');
    }
  }

  selectFilterOption(e: { key: string, value: string }) {
    let queryParams: any = {};
    queryParams[e.key] = e.value
    if (e.value === '') {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams[e.key];
      this.router.navigateByUrl(currentUrlTree);
      this.initProducts();
    } else {
      this.initProducts();
      this.router.navigate([], { relativeTo: this.route, queryParams: queryParams, queryParamsHandling: 'merge' });
    }
  }


  // --------- F I L T E R  C H E K E R S --------
  filtering() {
    this.route.queryParams.subscribe(q => {
      for (let i in this.category.specifications) {
        if (q[this.category.specifications[i].key]) {
          let specValuesArray: string[] = q[this.category.specifications[i].key].split(",");
          this.products = this.products.filter(p => specValuesArray.includes(p.specifications[i].value))
        }
      }
    });
  }








}
