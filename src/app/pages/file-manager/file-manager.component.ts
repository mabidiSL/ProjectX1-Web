/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RootReducerState } from 'src/app/store';
import { selectDataFileManager, selectDataLoading, selectStorageQuota } from 'src/app/store/fileManager/file-manager-selector';
import { addFileManagerlist, fetchFileManagerlistData, deleteFileManagerlist, getStorageQuota } from 'src/app/store/fileManager/file-manager.action';

interface FolderNode {
  name: string;
  path: string;
  isExpanded: boolean;
  subFolders?: FolderNode[];
  files?: FileNode[];
}

interface FileNode {
  name: string;
  key: string;
  lastModified: string;
  size: number;
}

interface StorageQuota {
  size: string;
  storageLimit: string;
  percentage: string;
}

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

    breadCrumbItems: Array<object>;
    radialoptions: any;
    public isCollapsed: boolean = false;
    dismissible = true;
    Recentfile: any[] = [];
    RootFolder$: Observable<string> ;
    storageQuota$: Observable<StorageQuota>;
    
    rootFolder: string = null;
    firstLoad: boolean = false;
    loading$: Observable<boolean>;
    FolderList$: Observable<any>;
    folderList: string[] = [];
    fileList: any[] = [];
    isCreateFolderModalOpen : boolean = false;
    folderNameControl: FormControl;
    editingFolder: any = null;
    tempFolderName: string = '';
    folderTree: FolderNode[] = [];
    currentPath: string = '';
    isRenamingFolder: boolean = false;
    editingFolderName: string = '';
    isRenamingFile: boolean = false;
    editingFile: FileNode = null;
    storageQuota: StorageQuota = null;

    constructor(
      public router: Router,
      private readonly store: Store<{ data: RootReducerState }>) {
        this.FolderList$ = this.store.pipe(select(selectDataFileManager));
        this.loading$ = this.store.pipe(select(selectDataLoading));  
        this.storageQuota$ = this.store.pipe(select(selectStorageQuota)) as Observable<StorageQuota>;
        // this.RootFolder$ = this.store.pipe(select(selectDataRootFolder));
        this.folderNameControl = new FormControl('project-x1/');
        }

    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Files' }, { label: 'File Manager', active: true }];
      this.fetchFolders()
      
      this.fetchStorageQuota();
      this.initializeRadialChart();
    }
    fetchFolders(folderName?: string | null) {
      this.store.dispatch(fetchFileManagerlistData({ folderName: folderName }));  
      this.FolderList$.subscribe(data => {
        // Group folders by their parent path
        const foldersByParent = new Map<string, FolderNode[]>();
        
        data?.folders?.forEach(folderPath => {
          const parts = folderPath.split('/');
          const name = parts[parts.length - 1];
          const parentPath = parts.slice(0, -1).join('/');
          
          const folder: FolderNode = {
            name,
            path: folderPath,
            isExpanded: false,
            subFolders: [],
            files: []
          };

          if (!foldersByParent.has(parentPath)) {
            foldersByParent.set(parentPath, []);
          }
          foldersByParent.get(parentPath).push(folder);
        });

        // Create root level folders
        const rootFolders = foldersByParent.get('') || [];
        this.folderTree = rootFolders;
        this.folderList = rootFolders.map(f => f.name);
        this.fileList = data?.files?.map(file => ({
         
          name: file.name.split('/').pop(),
          key: file.Key,
          lastModified: new Date(file.LastModified).toLocaleDateString('en-CA'),
          size: file.Size
        })) || [];
        console.log(this.fileList);
      });
    }

    fetchSubFolders(folderPath: string) {
      this.store.dispatch(fetchFileManagerlistData({ folderName: folderPath }));
      
      // Don't update the UI immediately, wait for the backend response
      this.FolderList$.subscribe(data => {
        if (data?.folders) {  // Only process if we have data from backend
          // Convert the retrieved data into folder nodes
          const folders = data.folders.map(folderPath => {
            const pathParts = folderPath.split('/');
            const name = pathParts[pathParts.length - 1];
            return {
              name,
              path: folderPath,
              isExpanded: false,
              subFolders: [],
              files: []
            } as FolderNode;
          });

          const files = data.files?.map(file => ({
            name: file.name.split('/').pop(),
            key: file.Key,
            lastModified: new Date(file.LastModified).toLocaleDateString('en-CA'),
            size: file.Size
          })) || [];

          // Update the tree structure with the new data
          this.updateFolderTree(this.folderTree, folderPath, folders, files);
          
          // Update the current view only if we have data
          const currentFolder = this.findFolderByPath(this.folderTree, folderPath);
          if (currentFolder) {
            this.folderList = folders.map(f => f.name);
            this.fileList = files;
            currentFolder.isExpanded = true;
          }
          this.currentPath = folderPath;
        }
      });
    }

    private updateFolderTree(tree: FolderNode[], path: string, folders: FolderNode[], files: FileNode[]) {
      console.log('updateFolderTree', tree, path, folders, files);
      if (!path) {
        this.folderTree = folders;
        return;
      }

      const pathParts = path.split('/').filter(p => p);
      let currentLevel = tree;
      let targetFolder: FolderNode = null;

      // Find the target folder
      for (const part of pathParts) {
        targetFolder = currentLevel.find(f => f.name === part);
        if (!targetFolder) {
          // Create the folder if it doesn't exist
          targetFolder = {
            name: part,
            path: pathParts.slice(0, pathParts.indexOf(part) + 1).join('/'),
            isExpanded: false,
            subFolders: [],
            files: []
          };
          currentLevel.push(targetFolder);
        }
        currentLevel = targetFolder.subFolders;
      }

      // Update only the target folder
      if (targetFolder) {
        targetFolder.subFolders = folders;
        targetFolder.files = files;
        targetFolder.isExpanded = true;
      }
    }

    private findFolderByPath(tree: FolderNode[], path: string): FolderNode {
      if (!path) return null;
      
      const pathParts = path.split('/').filter(p => p);
      let currentLevel = tree;
      let targetFolder: FolderNode = null;

      for (const part of pathParts) {
        targetFolder = currentLevel.find(f => f.name === part);
        if (!targetFolder) {
          return null;
        }
        currentLevel = targetFolder.subFolders;
      }

      return targetFolder;
    }

    _ClickRootFolder() {
      this.currentPath = '';
      this.fetchFolders();
      this.isCollapsed = !this.isCollapsed;
    }
      renameItem(item: FolderNode | FileNode, event?: Event): void {
        if (event) {
          event.stopPropagation();
        }
        
        const isFile = 'key' in item;
        this.isRenamingFolder = !isFile;
        this.isRenamingFile = isFile;
        
        if (isFile) {
          this.editingFile = item as FileNode;
        } else {
          this.editingFolder = item as FolderNode;
        }
        this.editingFolderName = item.name;
        
        setTimeout(() => {
          const input = document.getElementById('rename-input') as HTMLInputElement;
          if (input) {
            input.focus();
            input.select();
          }
        });
      }

      // saveRename(item: FolderNode | FileNode, newName: string, event: Event): void {
      //   event.stopPropagation();
      //   if (newName && newName !== item.name) {
      //     const parentPath = item.path.split('/').slice(0, -1).join('/');
      //     const newPath = parentPath ? `${parentPath}/${newName}` : newName;
          
      //     this.store.dispatch(updateFileManagerlist({ 
      //       updatedData: JSON.stringify({
      //         oldPath: item.path,
      //         newPath: newPath
      //       })
      //     }));
      //   }
      //   this.isRenamingFolder = false;
      //   this.isRenamingFile = false;
      //   this.editingFolder = null;
      //   this.editingFile = null;
      // }

      async deleteItem(item: FolderNode | FileNode, event?: Event): Promise<void> {
        if (event) {
          event.stopPropagation();
        }
        
        const isFile = 'key' in item;
        const itemType = isFile ? 'file' : 'folder';
        const confirmDelete = await this.showDeleteConfirmDialog(itemType, item.name);
        
        if (confirmDelete) {
          this.store.dispatch(deleteFileManagerlist({ 
            key: isFile ? (item).key : (item).path,
            typeFile: isFile ? 'file' : 'folder'
          }));

          // Update local tree structure
          if (isFile) {
            const parentFolder = this.findParentFolder(this.folderTree, item.key);
            if (parentFolder) {
              parentFolder.files = parentFolder.files.filter(f => f.key !== item.key);
            }
          } else {
            const parentFolder = this.findParentFolder(this.folderTree, item.path);
            if (parentFolder) {
              parentFolder.subFolders = parentFolder.subFolders.filter(f => f.path !== item.path);
            } else {
              this.folderTree = this.folderTree.filter(f => f.path !== item.path);
            }
          }
        }
      }
    
  // Open the folder creation modal
  openCreateFolderModal(): void {
    this.isCreateFolderModalOpen = true;
  }

  // Close the folder creation modal
  closeCreateFolderModal(): void {
    this.isCreateFolderModalOpen = false;
   // this.folderNameControl.setValue('project-x1/'); 
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

  toggleFolder(folder: FolderNode, event: Event): void {
    event.stopPropagation();
    if (folder.subFolders?.length) {
      folder.isExpanded = !folder.isExpanded;
    } else if (!folder.isExpanded) {
      // Only fetch if we're expanding and don't have subfolders yet
      this.fetchSubFolders(folder.path);
    }
  }

  private findParentFolder(tree: FolderNode[], path: string): FolderNode | null {
    const pathParts = path.split('/');
    if (pathParts.length <= 1) return null;

    const parentPath = pathParts.slice(0, -1).join('/');
    return this.findFolderByPath(tree, parentPath);
  }

  async showDeleteConfirmDialog(itemType: string, itemName: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const modalDiv = document.createElement('div');
      modalDiv.innerHTML = `
        <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete ${itemType} "${itemName}"?</p>
                <p class="text-danger mb-0">This action cannot be undone.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show"></div>
      `;

      document.body.appendChild(modalDiv);
      document.body.classList.add('modal-open');

      const closeModal = () => {
        document.body.removeChild(modalDiv);
        document.body.classList.remove('modal-open');
      };

      // Handle close button click
      const closeBtn = modalDiv.querySelector('.btn-close');
      closeBtn.addEventListener('click', () => {
        closeModal();
        resolve(false);
      });

      // Handle cancel button click
      const cancelBtn = modalDiv.querySelector('.btn-secondary');
      cancelBtn.addEventListener('click', () => {
        closeModal();
        resolve(false);
      });

      // Handle delete button click
      const deleteBtn = modalDiv.querySelector('.btn-danger');
      deleteBtn.addEventListener('click', () => {
        closeModal();
        resolve(true);
      });

      // Handle click outside modal
      modalDiv.querySelector('.modal').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
          closeModal();
          resolve(false);
        }
      });

      // Handle escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeModal();
          resolve(false);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  }

  fetchStorageQuota(): void {
    // Assuming you're using your CrudService to fetch the data
    this.store.dispatch(getStorageQuota());
    this.storageQuota$.subscribe(data => {
      this.storageQuota = data;
      this.updateRadialChart();
    });
  }

  private initializeRadialChart(): void {
    this.radialoptions = {
      series: [0], // Will be updated when data arrives
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
            margin: 5,
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
              fontSize: '16px',
              formatter: function(val: number) {
                return val + '%';
              }
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
      labels: ['Storage Used'],
      tooltip: {
        enabled: true,
        y: {
          formatter: () => {
            return this.storageQuota?.size + ' / ' + this.storageQuota?.storageLimit;
          }
        }
      }
    };
  }

  private updateRadialChart(): void {
    if (this.storageQuota) {
      // Convert percentage string to number
      const percentage = parseFloat(this.storageQuota.percentage);
      this.radialoptions.series = [percentage];
      
      // Update the chart
      if (this.radialoptions) {
        this.radialoptions.series = [percentage];
      }
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // downloadFile(file: FileNode): void {
  //   // Create a download URL using the file's key
  //   const downloadUrl = `/api/storage/download/${encodeURIComponent(file.key)}`;
    
  //   // Create a temporary anchor element
  //   const link = document.createElement('a');
  //   link.href = downloadUrl;
  //   link.download = file.name; // Set the download filename
    
  //   // Append to body, click, and remove
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }
}