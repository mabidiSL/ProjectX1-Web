/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import {  offerSalesBarChart } from './data';
import { ChartType } from './dashboard.model';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CustomerRatingChart, LinewithDataChart, MostPaymentMethodChart } from './chart-config';
import { _User } from 'src/app/store/Authentication/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ApexOptions } from 'ng-apexcharts';
import { Observable } from 'rxjs';
import {  Store } from '@ngrx/store';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, AfterViewInit {
  modalRef?: BsModalRef;
  isVisible: string;
  MostPaymentMethodChart : ChartType = MostPaymentMethodChart;
  LinewithDataChart: ApexOptions = LinewithDataChart;
  CustomerRatingChart: ChartType = CustomerRatingChart;
  offerSalesBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions: any;
  statData: any;
  rateStatics : any;
  rating: any;
  currentRole: string;
  companyId: number;
  config:any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  public currentUser: _User;
  isLoading = false;
  isLoadingSales = false;
  isActive: string = 'month';
  orderList$: Observable<any[]>;

// statistic params
  ChartPeriod: number = 6;
  offerViewImpressionDuration: string = 'month';
  VisitorStatisticsDuration: string = 'month';
  rateDuration: string = 'month';
  coupouSalesDuration: string = 'month';
  giftcardSalesDuration: string = 'month';
  latestTransactions: any[]= [];

  @ViewChild('content') content;
  @ViewChild('center', { static: false }) center?: ModalDirective;
  constructor(private readonly modalService: BsModalService, 
    private readonly configService: ConfigService,
     private readonly eventService: EventService,
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthenticationService,
    private readonly store: Store
  ) {

      this.authService.currentUser$.subscribe(user => {
        if (user) {
        this.currentRole = user.role.translation_data[0].name;
        this.companyId =  user.companyId;
      }});
     if(this.currentRole && (this.currentRole === 'Admin' || this.currentRole === 'Merchant'))
      { this.isLoading = true;
        this.isLoadingSales = true;
        this.dashboardService.getStatistics(this.rateDuration,this.VisitorStatisticsDuration,this.ChartPeriod,this.coupouSalesDuration, this.giftcardSalesDuration).subscribe(
          response =>{
            this.isLoading = false;
            this.isLoadingSales = false;
            this.rateStatics = response.result
            this.latestTransactions = this.rateStatics.latestCustomerTransactions;
            this.updateVisitorStatistics();
            this.updateCustomerRatingChart();
            this.updateStatisticsData();
            this.updateOfferSalesChart();

          });
      }
  }
  
  fetchDashboardStatistics(chartType: string,
    rateDuration: string,
    offerViewImpressionDuration: string,
    period: number,
    couponSalesDuration: string,
    giftCardSalesDuration : string){
    this.dashboardService.getStatistics(rateDuration, offerViewImpressionDuration,  period, couponSalesDuration,  giftCardSalesDuration).subscribe(
      response =>{
        this.rateStatics = response.result;
        this.isLoading = false;
        this.isLoadingSales = false;
        if(chartType === 'visitor')
          this.updateVisitorStatistics();
        else if(chartType === 'offer-sales')
          this.updateOfferSalesChart();
        
      });
  }
  ngOnInit() {
    
    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute('data-layout');

    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
     this.center?.show()
    }, 2000);
  }
  updateStatisticsData(){
    if(this.currentRole === 'Admin' || this.companyId === 1 ){
    this.statData = [
      {
        icon: "bx bx-store", 
        title: "Merchants",
        link: "/private/merchants/list",
        value: this.rateStatics.totalMerchants
      },
      {
        icon: "bx bx-store",
        title: "Merchant Branches",
        link: "/private/stores/list",
        value: this.rateStatics.totalStores
      },
      {
        icon: "bx bxs-coupon",
        title: "Coupons",
        link: "/private/coupons/list",
        value: this.rateStatics.totalCoupons
      },
      {
        icon: 'bx bxs-gift',
        title: "Gift Cards",
        link:'/private/giftCards/list',
        value: this.rateStatics.totalGiftCards
      },
      {
        icon: "bxs-user-detail",
        title: "Customers",
        link: "/private/customers/list",
        value: this.rateStatics.totalCustomers
      },
      {
        icon: "bxs-user-detail",
        title: "Employees",
        link: "/private/employees/list",
        value: this.rateStatics.totalEmployees
      }
     
    ];
  } else {
    this.statData = [
      
      {
        icon: "bx bx-store",
        title: "Merchant Branches",
        link: "/private/stores/list",
        value: this.rateStatics.totalStores
      },
      {
        icon: "bxs-user-detail",
        title: "Merchant Employees",
        link: "/private/employees/list",
        value: this.rateStatics.totalEmployees
      },
      {
        icon: "bx bxs-coupon",
        title: "Live Coupons",
        link: "/private/coupons/list",
        value: this.rateStatics.totalCoupons
      },
      {
        icon: 'bx bxs-gift',
        title: "Live Gift Cards",
        link:'/private/giftCards/list',
        value: this.rateStatics.totalGiftCards
      }
     
    ];}

  }

  private updateCustomerRatingChart() {
    
    if (!this.rateStatics || !this.rateStatics.rateStats) {
      return;
    }

    const { oneStar, twoStars, threeStars, fourStars, fiveStars } = this.rateStatics.rateStats;

    this.CustomerRatingChart.series = [
      fiveStars.total, 
      fourStars.total, 
      threeStars.total, 
      twoStars.total, 
      oneStar.total 
    ];
  }
  private updateOfferSalesChart() {
    if (!this.rateStatics ) {
      return;
    }
    const dataMappingSeries = [
      { key: 'couponSales', name: 'Coupons Sales'},
      { key: 'giftCardSales', name: 'GiftCards Sales'}
      ];
      console.log(dataMappingSeries);
      
      // Extract periods once since they are the same for all serie
     const categories = this.rateStatics.couponSales?.map((item: any) => item.period);
     console.log(categories);
     
    if (categories) {
      const range = this.dashboardService.getRangeDescription(categories);
      this.setChartDuration(range, 'sales');
    }
  
    this.offerSalesBarChart.series = dataMappingSeries.map(({ key, name }) => {
      const data = this.rateStatics[key]?.map((item: any) => item.count).reverse() || [];
      return { name, data };
    });
    console.log(this.offerSalesBarChart.series);

  }
  private updateVisitorStatistics(){
    if (!this.rateStatics ) {
      return;
    }
    const seriesDataMapping = [
      { key: 'viewedCoupons', name: 'Coupons Views' },
      { key: 'viewedGiftCards', name: 'Gift Cards Views' },
      { key: 'couponImpressons', name: 'Coupons Impressions' },
      { key: 'giftCardsImpressons', name: 'Gift Cards Impressions' },
    ];
  
    // Extract periods once since they are the same for all series
    const categories = this.rateStatics.couponImpressons?.map((item: any) => item.period);
    if (categories) {
      const range = this.dashboardService.getRangeDescription(categories);
      this.setChartDuration(range, 'visitor');
    }
  
    this.LinewithDataChart.series = seriesDataMapping.map(({ key, name }) => {
      const data = this.rateStatics[key]?.map((item: any) => item.count).reverse() || [];
      return { name, data };
    });
    
  }

  setChartDuration(period: any[], chartTitle: string){

    if(chartTitle === 'visitor'){
    const title = (this.VisitorStatisticsDuration === 'year') 
    ? 'Years' 
    : (this.VisitorStatisticsDuration === 'month') 
      ? 'Months' 
      : 'Weeks';
      const xaxis = {categories: period, title: {
        text: title
      }};
      this.LinewithDataChart.xaxis = xaxis;
    }else if(chartTitle === 'sales'){
      const title = (this.coupouSalesDuration === 'year') 
    ? 'Years' 
    : (this.coupouSalesDuration === 'month') 
      ? 'Months' 
      : 'Weeks';
      const xaxis = {categories: period, title: {
        text: title
      }};
      this.offerSalesBarChart.xaxis = xaxis;
    }
    


  }
  /**
   * Fetches the data
   */
  private fetchData() {
    this.MostPaymentMethodChart.series = [200,30,10,50];
    this.offerSalesBarChart = offerSalesBarChart;
    //this.monthlyEarningChart = monthlyEarningChart;

   // this.isActive = 'month';
    // this.configService.getConfig().subscribe(data => {
    //   this.transactions = data.transactions;
      
    // });
  }
  setVisitorOffersSatisticsDuration(duration: string) {
    this.VisitorStatisticsDuration = duration;
    this.isLoading = true;
    this.fetchDashboardStatistics('visitor',this.rateDuration,this.VisitorStatisticsDuration,this.ChartPeriod,this.coupouSalesDuration, this.giftcardSalesDuration);
    
  }
   
  setOfferSalesDuration(duration: string) {
    this.isActive = duration;
    this.isLoadingSales = true;
    this.coupouSalesDuration = duration;
    this.giftcardSalesDuration = duration;
    this.fetchDashboardStatistics('offer-sales',this.rateDuration,this.VisitorStatisticsDuration,this.ChartPeriod,this.coupouSalesDuration, this.giftcardSalesDuration);

  }
  
  opencenterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  


  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}
