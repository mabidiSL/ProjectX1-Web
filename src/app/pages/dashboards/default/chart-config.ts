import { ApexAxisChartSeries, ApexOptions } from 'ng-apexcharts';
import { ChartType } from './dashboard.model'; 

export const CustomerRatingChart: ChartType = {
  series: [],
  chart: {
    type: 'donut',
    height: 240,
  },
  labels: ['Rating 5*', 'Rating 4*', 'Rating 3*', 'Rating 2*', 'Rating 1*'],
  colors: ["#DEB660", "#ADA7A1", "#A79065", "#A79065", "#B0B0B0"],
  legend: {
    show: true,
  },
  dataLabels: {
    enabled: true,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
      }
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ]
};
export const MostPaymentMethodChart: ChartType = {
    series: [],
    chart: {
      type: 'donut',
      height: 240,
    },
    labels: ['Apple Pay', 'Bank', 'STC Pay', 'Wallet Point'],
    colors: ["#DEB660", "#ADA7A1", "#A79065", "#A79065"],
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };
export const LinewithDataChart: ApexOptions = {
    chart: {
      type: 'line', // Line chart type
      height: 350,  // Set chart height
      zoom: {
        enabled: false // Disable zooming on the chart
      }
    },
    series: [
      {
        name: 'Coupons Impressions',
        data: [30, 40, 45, 50, 49, 60, 70]  // Replace with dynamic data
      },
      {
        name: 'Coupons Views',
        data: [20, 30, 35, 40, 45, 50, 60]  // Replace with dynamic data
      },
      {
        name: 'Gift Cards Impressions',
        data: [15, 25, 30, 35, 40, 45, 50]  // Replace with dynamic data
      },
      {
        name: 'Gift Cards Views',
        data: [10, 20, 25, 30, 35, 40, 45]  // Replace with dynamic data
      }
    ] as ApexAxisChartSeries,
    colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],  // Custom colors for each line
    title: {
      text: 'Visitor Statistics',  // Title for the chart
      align: 'center'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],  // X-axis categories (e.g., months)
      title: {
        text: 'Months'
      }
    },
    yaxis: {
      title: {
        text: 'Impressions/Views'
      },
      min: 0  // Minimum value for Y-axis
    },
    stroke: {
      width: 3  // Line thickness
    },
    markers: {
      size: 5,  // Size of the data point markers
      colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
      strokeWidth: 2
    },
    dataLabels: {
      enabled: false  // Disable data labels on the chart
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250  // Adjust height for smaller screens
          },
          yaxis: {
            labels: {
              show: false
            }
          }
        }
      }
    ],
    legend: {
      position: 'top',  // Position of the legend
      horizontalAlign: 'center'
    }
  };
  