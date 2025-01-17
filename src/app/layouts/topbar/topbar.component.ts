/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { changesLayout } from 'src/app/store/layouts/layout.actions';
import { getLayoutMode } from 'src/app/store/layouts/layout.selector';
import { RootReducerState } from 'src/app/store';
import { _User } from 'src/app/store/Authentication/auth.models';
import { logout } from 'src/app/store/Authentication/authentication.actions';
import { SocketService } from 'src/app/core/services/webSocket.service';
import { fetchMyNotificationlistData, updateNotificationlist } from 'src/app/store/notification/notification.action';
import { selectDataMyNotification,  selectDataUnseenCount } from 'src/app/store/notification/notification-selector';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Notification } from 'src/app/store/notification/notification.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit, OnDestroy {
  mode: any
  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  theme: any;
  layout: string;
  dataLayout$: Observable<string>;
  public currentUser: _User;
  notifications: Notification[] = [];
  nbrNotif: number = 0 ;
  unseenNotif$: Observable<number>;
  notifications$ : Observable<Notification[]>;
  notificationsSubscription: Subscription;
  notificationsSubject = new BehaviorSubject<any[]>([]);
  height: number = 0;  // Dynamic height
  maxHeight: number = 500;  // Maximum height for the container
  loading$: Observable<boolean>;


  // Define layoutMode as a property

  constructor(@Inject(DOCUMENT) private document: any, 
    private router: Router, 
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService, 
    public store: Store<RootReducerState>,
    private socketService: SocketService,
    private loaderService: LoaderService,
    public authService: AuthenticationService
    ) {
              this.loading$ = this.store.pipe(select(selectDataLoading)); 
              this.notifications$ = this.store.pipe(select(selectDataMyNotification));
              this.unseenNotif$ = this.store.pipe(select(selectDataUnseenCount));     
      this.socketService.Connect();
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.currentUser = user;
        }
      });
        
    }
  updateHeight() {
        const baseHeight = 50;  // Assume each notification takes 50px height
        const calculatedHeight = this.notifications.length * baseHeight;
    
        // Ensure height does not exceed maxHeight
        this.height = Math.min(calculatedHeight, this.maxHeight);
      }
  private fetchNotification(){
    this.store.dispatch(fetchMyNotificationlistData());
    this.notifications$.subscribe( (data) => {
        if(data)  {
          this.notifications = data;
        }
              
    });
  }
     
  private listenForMessages() {
     this.socketService.messages$.subscribe(message => {
   
        if(message){
          this.fetchNotification();
        }
  });  
}        
  
    

  listLang: any = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'French', flag: 'assets/images/flags/french.jpg', lang: 'fr' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'sp' },
    { text: 'Arabic', flag: 'assets/images/flags/ar.jpg', lang: 'ar' },

  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.listenForMessages();

    this.store.select('layout').subscribe((data) => {
      this.theme = data.DATA_LAYOUT;
    })
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
 
      
   
  }
  getNotificationRoute(notification: any): string {
    // Map notification types to routes
    switch (notification.type) {
      case 'merchant-registration':
        return 'private/merchants/list';
      case 'coupon-approval-request':
        return 'private/coupons/list';
      case 'giftcard-approval-request':
        return 'private/giftCards/list';
      case 'coupon-approved':
        return 'private/coupons/list';
      case 'giftcard-approved':
        return 'private/giftCards/list';
      case 'coupon-purchase':
         return `private/orders/list`;
      
   
  }
//   const notif_ref = notification.type;
//   switch (notification.type) {
//     case 'merchant-registration':
//       return `private/merchants/view/${notif_ref}`;
//     case 'coupon-approval-request':
//       return `private/coupons/view/${notif_ref}`;
//     case 'giftcard-approval-request':
//       return `private/giftCards/view/${notif_ref}`;
//     case 'coupon-approved':
//       return `private/coupons/view/${notif_ref}`;
//     case 'giftcard-approved':
//       return `private/giftCards/view/${notif_ref}`;
//     case 'coupon-purchase':
//        return `private/orders/view/${notif_ref}`;
    
 
// }
}
   navigateToNotification(notification: any) {
    // Update Notification to be set as Seen
      this.socketService.sendMessage(notification.translation_data[0]?.title);
      notification.seen = true;
      const notifcationObject = {id : notification.id, seen: true};
      const route = this.getNotificationRoute(notification); // Get the route dynamically
      this.router.navigate([route]);
      this.store.dispatch(updateNotificationlist({updatedData: notifcationObject, route:route}))
     // this.fetchNotification();
    
   }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.loaderService.isLoading.next(true);
    this.languageService.setLanguage(lang);
    setTimeout(() => {
      // Hide loader once the language is applied or after some delay
      this.loaderService.isLoading.next(false);  // Hide the spinner
    }, 1000); // Adjust this delay according to how long it takes to load the data

      
  }
  
  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
      this.store.dispatch(logout());
         
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  changeLayout(layoutMode: string) {
    this.theme = layoutMode;
    this.store.dispatch(changesLayout({ layoutMode }));
    this.store.select(getLayoutMode).subscribe((layout) => {
      document.documentElement.setAttribute('data-layout', layout)
    })
  }
  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe(); // Clean up subscription
    }  }

}