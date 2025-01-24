/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RootReducerState } from 'src/app/store';
import { selectDataFileManager, selectDataLoading, selectDataRootFolder } from 'src/app/store/fileManager/file-manager-selector';
import { addFileManagerlist, fetchFileManagerlistData } from 'src/app/store/fileManager/file-manager.action';

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
    RootFolder$: Observable<string> ;
    rootFolder: string = null;
    firstLoad: boolean = false;
    loading$: Observable<boolean>;
    FolderList$: Observable<any>;
    folderList: string[] = [];
    fileList: any[] = [];
    isCreateFolderModalOpen : boolean = false;
    folderNameControl: FormControl;
    
    constructor(
      public router: Router,
      private readonly store: Store<{ data: RootReducerState }>) {
        this.store.dispatch(fetchFileManagerlistData({ folderName: null }));
        this.FolderList$ = this.store.pipe(select(selectDataFileManager));
        this.loading$ = this.store.pipe(select(selectDataLoading));  
        this.RootFolder$ = this.store.pipe(select(selectDataRootFolder));
        this.folderNameControl = new FormControl('project-x1/');
         }
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Files' }, { label: 'File Manager', active: true }];
      this.RootFolder$.subscribe(data => {
        this.rootFolder = data;
      });
      // this.FolderList$.subscribe(data => {
      //   this.RootFolder = data?.folders?.[0];
      //   console.log(this.RootFolder);
        
      // });
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
    fetchSubFolders(folderName: string){
      if(folderName !== this.rootFolder){
        folderName = this.rootFolder + '/' + folderName;  
      }
      this.store.dispatch(fetchFileManagerlistData({ folderName: folderName }));  
      this.FolderList$.subscribe(data => {
        this.folderList = data.folders?.map(folderName => folderName.split('/')[1]);
    
        this.fileList = data.files?.map(file=> {
          const fileName = file?.name.split('/');
          return {name: fileName[fileName.length - 1], key: file.Key, lastModified: new Date(file.LastModified).toLocaleDateString('en-CA'), size: file.Size};
        });
        console.log(this.folderList);
        this.firstLoad = true;
      });
    }
      _ClickRootFolder(){
        //dispatch action to fetch the subfolders of the root folder
        this.fetchSubFolders(this.rootFolder);
        this.isCollapsed = !this.isCollapsed;
        
      }
   
  // Open the folder creation modal
  openCreateFolderModal(): void {
    this.isCreateFolderModalOpen = true;
  }

  // Close the folder creation modal
  closeCreateFolderModal(): void {
    this.isCreateFolderModalOpen = false;
    this.folderNameControl.setValue('project-x1/'); 
   }
  moveCursorToEnd(): void {
    setTimeout(() => {
      const inputElement = document.querySelector('input[formControlName="newFolderName"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length); // Move cursor to end
      }
    }, 0); // Ensuring it's done after the DOM update
  }
  // Handle folder creation
  createFolder(): void {
    const newFolderName = this.folderNameControl.value.trim();
      if (newFolderName?.includes('project-x1') && newFolderName.includes('/')) {

      this.store.dispatch(addFileManagerlist({ folderName: newFolderName }));

      // Close the modal after folder creation
      this.closeCreateFolderModal();

      // Optionally, refresh the folder list or fetch subfolders
      //this.fetchSubFolders(this.RootFolder$);
    }
  }
}
  