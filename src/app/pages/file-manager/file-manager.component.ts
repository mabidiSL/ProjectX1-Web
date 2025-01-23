/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { selectDataFileManager } from 'src/app/store/fileManager/file-manager-selector';
import { fetchFileManagerlistData } from 'src/app/store/fileManager/file-manager.action';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent implements OnInit {

    breadCrumbItems: Array<object>;
    radialoptions: any;
    public isCollapsed: boolean = false;
    dismissible = true;
    Recentfile: any[] = [];
  
    constructor(
      public router: Router,
      private readonly store: Store<{ data: RootReducerState }>) {
    }
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Apps' }, { label: 'File Manager', active: true }];
  
      this.store.dispatch(fetchFileManagerlistData({ folderName: '/' }));
      this.store.select(selectDataFileManager).subscribe(data => {
        this.Recentfile = data
        console.log(this.Recentfile);
        
      });
  
  
      this.radialoptions = {
        series: [76],
        chart: {
          height: 150,
          type: 'radialBar',
          sparkline: {
            enabled: true
          }
        },
        colors: ['#556ee6'],
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#e7e7e7",
              strokeWidth: '97%',
              margin: 5, // margin is in pixels
            },
            hollow: {
              size: '60%',
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                offsetY: -2,
                fontSize: '16px'
              }
            }
          }
        },
        grid: {
          padding: {
            top: -10
          }
        },
        stroke: {
          dashArray: 3
        },
        labels: ['Storage'],
      }
    }
  
  
  }
  