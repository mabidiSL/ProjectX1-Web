/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import {  emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CustomerRatingChart, LinewithDataChart, MostPaymentMethodChart } from './chart-config';
import { _User } from 'src/app/store/Authentication/auth.models';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ApexOptions } from 'ng-apexcharts';

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
  emailSentBarChart: ChartType;
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
  isActive: string;
  isActiveChartOption: string = 'month';

  @ViewChild('content') content;
  @ViewChild('center', { static: false }) center?: ModalDirective;
  constructor(private readonly modalService: BsModalService, 
    private readonly configService: ConfigService,
     private readonly eventService: EventService,
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthenticationService
  ) {

      
      this.authService.currentUser$.subscribe(user => {
        if (user) {
        this.currentRole = user.role.translation_data[0].name;
        this.companyId =  user.companyId;
      }});
       
     if(this.currentRole && (this.currentRole === 'Admin' || this.currentRole === 'Merchant'))
      { 
        this.dashboardService.getStatistics('month','month', 6).subscribe(
          response =>{
            this.rateStatics = response.result
            this.updateVisitorStatistics();
            this.updateCustomerRatingChart();
            this.updateStatisticsData();
          });
      }
  }
  fetchDashboardStatistics(period: string){
    this.dashboardService.getStatistics(period,period, 6).subscribe(
      response =>{
        this.rateStatics = response.result;
        this.isLoading = false;
        this.updateVisitorStatistics();
        
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
      this.setChartPeriod(range);
      console.log('here is the range',range);
    }
  
    this.LinewithDataChart.series = seriesDataMapping.map(({ key, name }) => {
      const data = this.rateStatics[key]?.map((item: any) => item.count) || [];
      return { name, data };
    });
    console.log(this.LinewithDataChart.series);
    
  }

  setChartPeriod(period: any[]){

    const title = (this.isActiveChartOption === 'year') 
    ? 'Years' 
    : (this.isActiveChartOption === 'month') 
      ? 'Months' 
      : 'Weeks';
      const xaxis = {categories: period, title: {
        text: title
      }};
      this.LinewithDataChart.xaxis = xaxis;
    console.log('new category',this.LinewithDataChart.xaxis.categories);
    console.log('new title text',this.LinewithDataChart.xaxis.title.text);


  }
  /**
   * Fetches the data
   */
  private fetchData() {
    this.MostPaymentMethodChart.series = [200,30,10,50];
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;

    this.isActive = 'year';
    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
      
    });
  }
  weeklyVisitorSatisticsReport() {
    this.isActiveChartOption = 'week';
    this.isLoading = true;
    this.fetchDashboardStatistics('week');
    
  }
  monthlyVisitorSatisticsReport() {
    this.isActiveChartOption = 'month';
    this.isLoading = true;
    this.fetchDashboardStatistics('month');

  }
  yearlyVisitorSatisticsReport() {
    this.isActiveChartOption = 'year';
    this.isLoading = true;
    this.fetchDashboardStatistics('year');

  }
  opencenterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  weeklyreport() {
    this.isActive = 'week';
    this.emailSentBarChart.series =
      [{
        name: 'Coupons',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Flash Deals',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Featured Deals',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }];
  }
 
  monthlyreport() {
    this.isActive = 'month';
    this.emailSentBarChart.series =
      [{
        name: 'Coupons',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Flash Deals',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Featured Deals',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }];
  }

  yearlyreport() {
    this.isActive = 'year';
    this.emailSentBarChart.series =
      [{
        name: 'Coupons',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Flash Deals',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Featured Deals',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }];
  }


  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}
