/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectDataLoading } from 'src/app/store/notification/notification-selector';
import { Observable } from 'rxjs';
import { verifyEmail } from 'src/app/store/Authentication/authentication.actions';
import { selectMessage } from 'src/app/store/Authentication/authentication-selector';
import { BackgroundService } from 'src/app/core/services/background.service';
import { RandomBackgroundService } from 'src/app/core/services/setBackgroundEx.service';

@Component({
  selector: 'app-confirmmail',
  templateUrl: './confirmmail.component.html',
  styleUrls: ['./confirmmail.component.scss']
})
export class ConfirmmailComponent implements OnInit {
  // set the currenr year
  year: number = new Date().getFullYear();
  token!: string;
  loading: boolean = false;
  loading$!: Observable<boolean>;
  message!: Observable<string>;

  constructor(private route: ActivatedRoute, // To access route params
    private store: Store,private randomBackgroundService: RandomBackgroundService,
    private backgroundService: BackgroundService,
     ) { 
      this.loading$ = this.store.pipe(select(selectDataLoading));
      this.message = this.store.pipe(select(selectMessage));
      

    }

  ngOnInit(): void {
    //document.body.classList.remove('auth-body-bg');
    const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
    this.randomBackgroundService.getRandomBackground(direction).subscribe(
      (randomImage) => {
        this.backgroundService.setBackground(randomImage);
      },
      (error) => {
        console.error('Error setting random background:', error);
      }
    );
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.store.dispatch(verifyEmail({token: this.token}));
      }
    });
  }
  
}
