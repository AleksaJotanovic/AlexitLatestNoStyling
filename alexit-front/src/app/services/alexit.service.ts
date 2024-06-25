import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, distinctUntilChanged, merge, single } from 'rxjs';
import { Category } from '../../models/category.model';
import { Courier } from '../../models/courier.model';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { Role } from '../../models/role.model';
import { Sale } from '../../models/sale.model';
import { User } from '../../models/user.model';
import { CrudService } from './crud.service';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Blog } from '../../models/blog.model';
import { blogContentItemTypes } from '../../constants/blog-content-item-types';

@Injectable({
  providedIn: 'root'
})
export class AlexitService {

  categories$ = new BehaviorSubject<Category[]>([]);
  products$ = new BehaviorSubject<Product[]>([]);
  users$ = new BehaviorSubject<User[]>([]);
  orders$ = new BehaviorSubject<Order[]>([]);
  roles$ = new BehaviorSubject<Role[]>([]);
  couriers$ = new BehaviorSubject<Courier[]>([]);
  sales$ = new BehaviorSubject<Sale[]>([]);
  pageViews$ = new BehaviorSubject<number>(0);
  subscribers$ = new BehaviorSubject<{ _id: string, email: string }[]>([]);
  blogTopics$ = new BehaviorSubject<{ _id: string, name: string }[]>([]);
  blogs$ = new BehaviorSubject<Blog[]>([]);

  userAllowed: any = !!this.cookies.get("access_token") ? jwtDecode(this.cookies.get("access_token")) : null;

  orderStatusList = [
    { id: 1, value: "Pending" },
    { id: 2, value: "AwaitingPayment" },
    { id: 3, value: "AwaitingFulfillment" },
    { id: 4, value: "AwaitingShipment" },
    { id: 5, value: "AwaitingPickup" },
    { id: 6, value: "PartiallyShipped" },
    { id: 7, value: "Completed" },
    { id: 8, value: "Shipped" },
    { id: 9, value: "Cancelled" },
    { id: 10, value: "Declined" },
    { id: 11, value: "Refunded" },
    { id: 12, value: "Disputed" }
  ];

  isSingleImagesUploaded$ = new Subject<boolean>();

  isGalleriesUploaded$ = new Subject<boolean>();

  isUploaded$ = new BehaviorSubject<{ singleImages: boolean, galleries: boolean }>({ singleImages: false, galleries: false });





  constructor(private crud: CrudService, private cookies: CookieService) { }



  deleteAnyFile(filePath: string) {
    this.crud.anyFileDelete(filePath).subscribe(() => console.log('File succesfully deleted.'));
  }


  // Kategorije
  initCategories() {
    this.crud.categoriesGet().subscribe((res) => this.categories$.next(res.data));
  }
  addCategory(category: Category, file: FormData) {
    this.crud.categoryImageUpload(file).subscribe((res: any) => {
      let categoryBody: Category = { ...category, image: `http://localhost:3000/categories/${res.data}` };
      this.crud.categoryPost(categoryBody).subscribe(() => this.initCategories());
    });
  }
  updateCategory(category: any) {
    this.crud.categoryPut(category).subscribe(() => this.initCategories());
  }
  deleteCategory(id: string, imagePath: string) {
    this.crud.categoryDelete(id, imagePath).subscribe(() => this.initCategories());
  }


  // Proizvodi
  initProducts() {
    this.crud.productsGet().subscribe((res) => this.products$.next(res.data));
  }
  addProduct(product: Product, formdata: FormData) {
    this.crud.productImagesUpload(formdata).subscribe((res: any) => {
      const productBody: Product = { ...product, images: res };
      this.crud.productPost(productBody).subscribe(() => this.initProducts());
    });
  }
  updateProduct(product: Product) {
    this.crud.productPut(product).subscribe(() => this.initProducts());
  }
  deleteProduct(id: string) {
    this.crud.productDelete(id).subscribe(() => this.initProducts());
  }


  // Users
  initUsers() {
    this.crud.usersGet().subscribe((res) => this.users$.next(res.data));
  }
  addUser(user: User) {
    this.crud.userPost(user).subscribe(() => this.initUsers());
  }
  updateUser(user: User) {
    this.crud.userPut(user).subscribe(() => this.initUsers());
  }
  deleteUser(id: string) {
    this.crud.userDelete(id).subscribe(() => this.initUsers());
  }

  // Orders.
  initOrders() {
    this.crud.ordersGet().subscribe((res) => this.orders$.next(res.data));
  }
  addOrder(order: Order | any) {
    this.crud.orderPost(order).subscribe(() => this.initOrders());
  }
  updateOrder(order: Order) {
    this.crud.orderPut(order).subscribe(() => this.initOrders());
  }
  deleteOrder(id: string) {
    this.crud.orderDelete(id).subscribe(() => this.initOrders());
  }

  mailOrderStatus(mailObj: any) {
    this.crud.orderMailPost(mailObj).subscribe((val) => console.log(val))
  }
  sendAccounting(orderId: string, accounting: string) {
    this.crud.accountingPost(orderId, accounting).subscribe((val) => console.log(val));
  }


  // Couriers
  initCouriers() {
    this.crud.couriersGet().subscribe((res) => this.couriers$.next(res.data));
  }
  addCourier(courier: Courier) {
    this.crud.courierPost(courier).subscribe((res) => this.initCouriers());
  }
  deleteCourier(id: string) {
    this.crud.courierDelete(id).subscribe((res) => this.initCouriers());
  }

  //Sales
  initSales() {
    this.crud.salesGet().subscribe((res) => this.sales$.next(res.data));
  }
  addSale(sale: any) {
    this.crud.salesPost(sale).subscribe(() => this.initSales());
  }

  //Page Views
  initPageViews() {
    this.crud.pageViewsGet().subscribe(res => this.pageViews$.next(res.data.views));
  }

  initRoles() {
    this.crud.rolesGet().subscribe(res => this.roles$.next(res.data));
  };



  // NEWSLETTER
  initSubscribers() {
    this.crud.subscribersGet().subscribe(v => this.subscribers$.next(v.data));
  }

  addSubscriber(email: string) {
    this.crud.subscriberPost(email).subscribe(() => this.initSubscribers());
  }

  sendNews(news: { newsType: string, email: string, content: string, image: string }) {
    this.crud.newsPost(news).subscribe(() => this.initSubscribers());
  }





  // ======================== BLOGS ===================================
  initBlogTopics() {
    this.crud.blogTopicsGet().subscribe(res => this.blogTopics$.next(res.data));
  }
  addBlogTopic(name: string) {
    this.crud.blogTopicPost(name).subscribe(() => this.initBlogTopics());
  }

  // --Blogs
  initBlogs() {
    this.crud.blogsGet().subscribe(res => this.blogs$.next(res.data));
  }


  updateSingleImages(value: boolean) {
    const currentValue = this.isUploaded$.getValue();
    this.isUploaded$.next({ ...currentValue, singleImages: value });
  }

  updateGalleries(value: boolean) {
    const currentValue = this.isUploaded$.getValue();
    this.isUploaded$.next({ ...currentValue, galleries: value });
  }

  addBlog(blog: Blog, file: FormData, singleImagesList: { id: number, file: FormData }[], galleriesList: { id: number, files: FormData }[]) {
    this.crud.blogUploadFeaturedImage(file).subscribe((res: any) => {

      let blogObj: Blog = { ...blog, featuredImage: `http://localhost:3000/blogs/featured/${res.data}`, date: String(new Date()) };


      let imageItemsArr = [];
      let galleryItemsArr = []


      for (let image of singleImagesList) {
        const item = blogObj.content.find(c => c._id === image.id);
        if (item !== undefined) {
          this.crud.blogUploadSingleImage(image.file).subscribe((res: any) => {
            item.value.push(`http://localhost:3000/blogs/singles/${res.data}`);
            imageItemsArr.push(item.value);
            if (imageItemsArr.length !== 0 && imageItemsArr.length === singleImagesList.length) {
              this.updateSingleImages(true);
            }
          });
        }
      }

      for (let gallery of galleriesList) {
        const item = blogObj.content.find(c => c._id === gallery.id);
        if (item !== undefined) {
          this.crud.blogUploadGallery(gallery.files).subscribe((res: any) => {
            if (item._id === gallery.id) {
              item.value = res;
              galleryItemsArr.push('');
              if (galleryItemsArr.length !== 0 && galleryItemsArr.length === galleriesList.length) {
                this.updateGalleries(true);
              }
            }
          });
        }

      }


      if (singleImagesList.length === 0 && galleriesList.length === 0) {
        this.crud.blogPost(blogObj).subscribe(() => this.initBlogs());
      } else if (singleImagesList.length > 0 && galleriesList.length === 0) {
        this.isUploaded$.subscribe({
          next: v => {
            if (v.singleImages && !v.galleries) {
              this.crud.blogPost(blogObj).subscribe(() => this.initBlogs());
            }
          }
        })
      } else if (singleImagesList.length === 0 && galleriesList.length > 0) {
        this.isUploaded$.subscribe({
          next: v => {
            if (!v.singleImages && v.galleries) {
              this.crud.blogPost(blogObj).subscribe(() => this.initBlogs());
            }
          }
        });
      } else if (singleImagesList.length > 0 && galleriesList.length > 0) {
        this.isUploaded$.subscribe({
          next: v => {
            if (v.singleImages && v.galleries) {
              this.crud.blogPost(blogObj).subscribe(() => this.initBlogs());
            }
          }
        })
      }



    });


  }

  updateBlog(blog: Blog) {
    this.crud.blogPut(blog).subscribe(() => this.initBlogs());
  }

  deleteBlog(id: string) {
    this.crud.blogDelete(id).subscribe(() => this.initBlogs());
  }







}
