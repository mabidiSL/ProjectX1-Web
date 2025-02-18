/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileManagerService } from 'src/app/core/services/file-manager.service';
import { RootReducerState } from 'src/app/store';
import { selectDataFileManager, selectDataLoading, selectRecentFiles, selectStorageQuota } from 'src/app/store/fileManager/file-manager-selector';
import { addFileManagerlist, fetchFileManagerlistData, deleteFileManagerlist, getStorageQuota, addFile, renameFileManager, fetchRecentFilesData } from 'src/app/store/fileManager/file-manager.action';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

interface TreeNode{
  folders?: FolderNode[];
  files?: FileNode[];
}
interface FolderNode {
  id?: number;
  name: string;
  path: string;
  isExpanded: boolean;
  isSelected: boolean;
  subFolders?: FolderNode[];
  files?: FileNode[];
}

interface FileNode {
  id?: number;
  name: string;
  s3Key: string;
  url: string;
  path: string;
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
export class FileManagerComponent implements OnInit, OnDestroy {

    breadCrumbItems: Array<object>;
    radialoptions: any;
    public isCollapsed: boolean = false;
    dismissible = true;
    Recentfile: any[] = [];
    recentFiles$: Observable<any[]>;
    RootFolder$: Observable<string> ;
    storageQuota$: Observable<StorageQuota>;
    currentFolder: any = null;
    rootFolder: string = null;
    firstLoad: boolean = false;
    loading$: Observable<boolean>;
    FolderList$: Observable<any>;
    folderList: any[] = [];
    fileList: any[] = [];
    isCreateFolderModalOpen : boolean = false;
    folderNameControl: FormControl;
    editingFolder: any = null;
    tempFolderName: string = '';
    //folderTree: FolderNode[] = [];
    folderTree: TreeNode = {};
    currentPath: string = '';

    isRenamingFolder: boolean = false;
    editingName: string = '';
    isRenamingFile: boolean = false;
    editingFile: FileNode = null;
    storageQuota: StorageQuota = null;
    currentLevel: number = 0;
    parentFolderPath: string = '';
    showBackButton: boolean = false;
    destroy$: Subject<void> = new Subject<void>();

    // File upload related properties
    isFileUploadModalOpen: boolean = false;
    selectedFiles: File[] = [];
    isDragging: boolean = false;
    searchTerm: string = '';

    constructor(
      public router: Router,
      private cdr: ChangeDetectorRef,
      private fileManagerService: FileManagerService,
      private readonly store: Store<{ data: RootReducerState }>) {
        this.FolderList$ = this.store.pipe(select(selectDataFileManager));
        this.loading$ = this.store.pipe(select(selectDataLoading));  
        this.storageQuota$ = this.store.pipe(select(selectStorageQuota)) as Observable<StorageQuota>;
        this.recentFiles$ = this.store.pipe(select(selectRecentFiles));
        // this.RootFolder$ = this.store.pipe(select(selectDataRootFolder));
        this.folderNameControl = new FormControl('');
        }

    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Files' }, { label: 'File Manager', active: true }];
      this.fetchRecentFiles();
      this.fetchRootTree();
      this.fetchStorageQuota();
      this.initializeRadialChart();
    }
    get filteredFolders() {
      return this.folderList.filter(folder => 
        folder.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    get filteredFiles() {
      return this.fileList.filter(file => 
        file.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    fetchRecentFiles(){
      console.log('i am in fetch recent files ');
    
      this.store.dispatch(fetchRecentFilesData({ limit: 10 }));
      this.recentFiles$.subscribe(data=>
        {
          this.Recentfile = data; console.log(this.Recentfile)

        });

    }
    fetchRootTree(){
      this.store.dispatch(fetchFileManagerlistData({ folderId: null }));
      this.FolderList$.pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (data) => this.handleFolderData(data),
        error: (error) => console.error('Error fetching folders:', error)
      });
    }
    handleFolderData(data: any) {
      console.log('Received data:', data);

      if (!data?.folders?.length && !data?.files?.length && this.currentFolder=== null) {
        this.folderTree = { folders: [], files: [] };
        this.folderList = [];
        this.fileList = [];
        return;
      }
    
      // Process folders for the tree
      const rootFolders: { folders: any[], files: any[] } = { folders: [], files: [] };
    
       
      // Update folderList for the current view
      this.folderList = data?.folders?.map(fol => ({
        id: fol.id,
        name: fol.name,
        path: fol.name,
        isExpanded: false,
        isSelected: false,
        subFolders: [],
        files: []
      })) || [];
    
      // Update fileList
      this.fileList = data?.files?.map(file => ({
        id: file.id,
        name: file.name,
        key: file.s3Key,
        type: file.contentType,
        lastModified: new Date(file.updatedAt).toLocaleDateString('en-CA'),
        size: file.Size,
        url: file.url
      })) || [];

      rootFolders.folders = this.folderList;
      rootFolders.files = this.fileList;
      this.updateFolderTree(this.currentFolder, rootFolders, this.fileList);
       
    }
    fetchFolders(folder?: any | null, event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.currentPath = folder?.name;
      this.currentFolder = folder;

      console.log('i am in folder tree', folder);
    
      // Set current folder and path
    
      // Set current path and navigation state
      if (folder) {
        if(folder?.name?.includes('/')){
          const pathParts = folder?.name?.split('/').filter(p => p);
          const parentPath = pathParts?.slice(0, -1).join('/');
          this.parentFolderPath = parentPath;
        }else{
          this.parentFolderPath = folder?.name;
        }
        this.showBackButton = true;
      } else {
        this.currentPath = null;
        this.showBackButton = false;
      }
    
      // Dispatch action to fetch data
      this.store.dispatch(fetchFileManagerlistData({ folderId: folder?.id }));
    }
    // fetchFolders(new_folder?: any | null, event?: Event) {
    //   if (event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //   }
    //   console.log('i am in folder tree', new_folder);

    //   // Set current path and navigation state
    //   if (new_folder) {
    //     const pathParts = new_folder.name.split('/').filter(p => p);
    //     const parentPath = pathParts.slice(0, -1).join('/');
    //     this.parentFolderPath = parentPath;
    //     this.showBackButton = true;
    //   } else {
    //     this.currentPath = null;
    //     this.showBackButton = false;
    //   }

    //   // Store current tree state before update if we're fetching subfolders
    //   const currentTree = new_folder ? this.folderTree : null;
      
    //   // Dispatch action to fetch data
    //   this.store.dispatch(fetchFileManagerlistData({ folderId: new_folder?.id }));
      
    //   // Create a new subscription with skip and take
    //   this.FolderList$.pipe(
    //     skip(1),
    //     takeUntil(this.destroy$)
    //   ).subscribe({
    //     next: (data) => {
    //       console.log('Received data:', data);
          
    //       if (!data?.folders?.length && !data?.files?.length) {
    //         this.folderTree = { folders: [], files: [] };
    //         this.folderList = [];
    //         this.fileList = [];
    //         return;
    //       }

    //       // Process folders for the tree
    //       let rootFolders: { folders: any[], files: any[] } = { folders: [], files: [] };
          
    //       rootFolders.folders = data?.folders?.map(f => {
    //         const name = f.name;
    //         return {
    //           id: f.id,
    //           name,
    //           path: f.path,
    //           isExpanded: false,
    //           isSelected: false,
    //           subFolders: [],
    //           files: []
    //         } as FolderNode;
    //       }) || [];

    //       // Update folderList for the current view
    //       this.folderList = data?.folders?.map(fol => ({
    //         id: fol.id,
    //         name: fol.name,
    //         path: fol.path
    //       })) || [];

    //       // Update fileList
    //       this.fileList = data?.files?.map(file => ({
    //         id: file.id,
    //         name: file.name,
    //         key: file.s3Key,
    //         type: file.contentType,
    //         lastModified: new Date(file.updatedAt).toLocaleDateString('en-CA'),
    //         size: file.Size,
    //         url: file.url
    //       })) || [];

    //       rootFolders.files = this.fileList;

    //       if (!new_folder) {
    //         // At root level, set the entire tree
    //         this.folderTree = rootFolders;
    //         console.log('Root tree:', this.folderTree);
    //       } else if (new_folder === undefined || new_folder === null) {
    //         console.log('i am in else folder not null', new_folder);
            
    //         // For subfolders, preserve the current tree and update the specific branch
    //         this.folderTree = currentTree;
    //         let newSubTree: { folders: any[], files: any[] } = { folders: [], files: [] };
    //         newSubTree.folders = this.folderList;
    //         newSubTree.files = this.fileList;
    //         this.updateFolderTree(new_folder, newSubTree, this.fileList);
    //         console.log('Updated subfolder tree:', this.folderTree);
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Error fetching folders:', error);
    //     }
    //   });
    // }

    private updateFolderTree(folder: any, newFolders: any, newFiles: FileNode[]) {
      if(!folder){
        this.folderTree = newFolders;
        console.log('NEW Folder Tree', {folderTree: this.folderTree, path: folder?.name, newFolders, newFiles });

      }
      else{
      const path = folder?.name;
      // Handle both cases where path might or might not have forward slashes
      const pathParts = path ? path.split(/[/\\]/).filter(p => p) : [];
      
      // If path is just a folder name without slashes (e.g., 'docs')
      if (pathParts.length === 1) {
        console.log('path lenght is 1', pathParts);
        
        // Create a new tree array to avoid mutating the original
        const updatedTree = this.folderTree?.folders.map(f => {
          if (f.id === folder.id) {
            // Return updated folder while preserving its existing properties
            return {
              ...f,
              id: f.id,
              path: f.name,
              subFolders: newFolders.folders,
              files: newFolders.files,
              isExpanded: true,
              isSelected: true
            };
          }
          // Return other folders unchanged
          return {
            ...f,
            isSelected: false
          };
        }) ;

        // If folder doesn't exist in tree, add it
        if (!updatedTree.some(f => f.name === pathParts[0])) {
          updatedTree.push({
            name: pathParts[0],
            path: pathParts[0],
            isExpanded: true,
            isSelected: true,
            subFolders: newFolders.folders,
            files: newFolders.files
          });
        }
        console.log('Previous tree ',this.folderTree);
        console.log('New Sub Tree', updatedTree);
        // Update the tree with the new state
        this.folderTree.folders = updatedTree;
        this.cdr.detectChanges();
        console.log('Updated tree ',this.folderTree);
        return;
      }
      }

      // For nested paths, create a new tree with updated structure
      // const updateNestedPath = (currentTree: TreeNode) => {
      //   return currentTree.folders.map(folder => {
      //     if (folder.name === pathParts[0]) {
      //       // This is part of our path, recurse into it
      //       return {
      //         ...folder,
      //         isExpanded: true,
      //         isSelected: pathParts.length === 1,
      //         subFolders: pathParts.length === 1 ? newFolders.folders : updateNestedPath(folder.subFolders),
      //         files: pathParts.length === 1 ? newFolders.files : folder.files
      //       };
      //     }
      //     // This is not part of our path
      //     return {
      //       ...folder,
      //       isSelected: false
      //     };
      //   });
      // };

      // Update the tree structure
      // const updatedTree = updateNestedPath(this.folderTree);
      
      // // If the folder doesn't exist at root level, create it
      // if (!updatedTree.some(f => f.name === pathParts[0])) {
      //   const newFolder: FolderNode = {
      //     name: pathParts[0],
      //     path: pathParts[0],
      //     isExpanded: true,
      //     isSelected: pathParts.length === 1,
      //     subFolders: pathParts.length === 1 ? newFolders : [],
      //     files: pathParts.length === 1 ? newFiles : []
      //   };
      //   updatedTree.push(newFolder);
      // }

      // this.folderTree = updatedTree;
    }

    private findFolderByPath(tree: FolderNode[], path: string): FolderNode {
      if (!path) return null;
      
      // Use the same path splitting logic as updateFolderTree
      const pathParts = path.split(/[/\\]/).filter(p => p);
      if (pathParts.length === 0) return null;
      
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
      renameItem(item: FolderNode | FileNode, event?: Event,dropdown?: BsDropdownDirective, view?: boolean): void {
        if (event) {
          event.stopPropagation();
        }
        if(dropdown){
       
          dropdown.hide();
        }
        //this.isRenamingFolder = !view;
        
        const isFile = 'key' in item;
        this.isRenamingFolder = !isFile;
        this.isRenamingFile = isFile;
        
        if (isFile) {
          this.editingFile = item as FileNode;
        } else {
          this.editingFolder = item as FolderNode;
        }
        this.editingName = item.name;
        if(isFile){
          setTimeout(() => {
            const input = document.getElementById('rename-file-view') as HTMLInputElement;
            if (input) {
              input.focus();
              input.select();
            }
          });
        }else{
        if (view) {
          setTimeout(() => {
            const input = document.getElementById('rename-input-view') as HTMLInputElement;
            if (input) {
              input.focus();
              input.select();
            }
          });
         const inputElement = document.getElementById('rename-input-view') as HTMLInputElement;
          if (inputElement) {
            inputElement.addEventListener('keyup', (e) => this.handleKeyUp(e, item));
          }
        }else{
        setTimeout(() => {
          const input = document.getElementById('rename-input') as HTMLInputElement;
          if (input) {
            input.focus();
            input.select();
          }
        });
       const inputElement = document.getElementById('rename-input') as HTMLInputElement;
        if (inputElement) {
          inputElement.addEventListener('keyup', (e) => this.handleKeyUp(e, item));
        }
      }}
       
      }
      cancelRename() {
        this.isRenamingFolder = false;
        this.isRenamingFile = false;
        this.editingFolder = null;
        this.editingFile = null;
      }
      // Handle key up event for the rename input
handleKeyUp(event: KeyboardEvent, item: FolderNode | FileNode): void {
  if (event.key === 'Enter') { 
    event.stopPropagation();
    this.renameItemConfirmed(item, this.editingName);
  }
}

// Rename the item and dispatch the action
renameItemConfirmed(item: FolderNode | FileNode, newName: string): void {
  const isFile = 'key' in item;
  if (newName && newName !== item.name) {
      if (isFile) {
        console.log('rename file', item);
        this.store.dispatch(renameFileManager({ id: item.id, new_name: newName, file_type: 'file' }));
      } else {
        console.log('rename folder', item);
        this.store.dispatch(renameFileManager({ id: item.id, new_name: newName, file_type: 'folder' }));
      }

      // Reset editing state
      this.isRenamingFolder = false;
      this.isRenamingFile = false;
      this.editingFolder = null;
      this.editingFile = null;
    }
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

      async deleteItem(item: FolderNode | FileNode, event?: Event, from?: 'recent' | 'fileManager'): Promise<void> {
        if (event) {
          event.stopPropagation();
        }
        console.log('delete File', item);
        
        const isFile = 's3Key' in item;
        const itemType = isFile ? 'file' : 'folder';
        const confirmDelete = await this.showDeleteConfirmDialog(itemType, item.name);
        
        if (confirmDelete) {
          this.store.dispatch(deleteFileManagerlist({ 
            id: item.id,
            typeFile: isFile ? 'file' : 'folder',
            from: from
          }));

          // Update local tree structure
          if (isFile) {
            this.fetchRecentFiles();
            const parentFolder = this.findParentFolder(this.folderTree.folders, item.s3Key);
            if (parentFolder) {
              parentFolder.files = parentFolder.files.filter(f => f.s3Key !== item.s3Key);
            }
          } else {
            const parentFolder = this.findParentFolder(this.folderTree.folders, item.path);
            if (parentFolder) {
              parentFolder.subFolders = parentFolder.subFolders.filter(f => f.path !== item.path);
            } 
            else {
              this.folderTree.folders = this.folderTree.folders.filter(f => f.path !== item.path);
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
    let newFolderName = null;
    if(this.currentFolder){
       newFolderName = this.currentFolder?.name+'/'+this.folderNameControl.value.trim();

    }else
       newFolderName = this.folderNameControl.value;

      console.log(newFolderName);
      this.store.dispatch(addFileManagerlist({ folderName: newFolderName, name: this.folderNameControl.value      
       }));

      // Close the modal after folder creation
      this.closeCreateFolderModal();
     // this.store.dispatch(fetchFileManagerlistData({ folderId: this.currentFolder?.id }));

      // Optionally, refresh the folder list or fetch subfolders
      //this.fetchSubFolders(this.RootFolder$);
   // }
  }

  toggleFolder(folder: FolderNode, event: Event): void {
    event.stopPropagation();
    console.log('i am in toggle folder', folder);
    
    const pathParts = folder.name.split('/').filter(p => p);
    const level = pathParts.length;

    // For levels deeper than 2, only update the view
    if (level > 2) {
      this.fetchFolders(folder, event);
      return;
    }

    // For levels 1 and 2, handle expansion
    folder.isExpanded = !folder.isExpanded;
    if (!folder.subFolders?.length && folder.isExpanded) {
      this.fetchFolders(folder.name, event);
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

  downloadFile(file: FileNode): void {
    // Create a download URL using the file's key
    const downloadUrl = file.url;
    window.open(downloadUrl, '_blank');
    
    // // Create a temporary anchor element
    // const link = document.createElement('a');
    // link.href = downloadUrl;
    // link.download = file.name; // Set the download filename
    
    // // Append to body, click, and remove
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  }

  navigateToParent(): void {
    if (this.currentPath) {
      const parts = this.currentPath.split('/');
      parts.pop();
      const parentPath = parts.join('/');
      this.fetchFolders(parentPath || null);
    }
  }

  openFileUploadModal(folder?: any) {
    this.currentPath = folder?.path || folder?.name;
    this.currentFolder = folder? folder : null;
    console.log('currentPath', this.currentPath);
    
    this.isFileUploadModalOpen = false;
    setTimeout(() => {
      this.isFileUploadModalOpen = true;
    });
  }

  closeFileUploadModal() {
    this.isFileUploadModalOpen = false;
    this.selectedFiles = [];
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!this.selectedFiles.some(f => f.name === file.name)) {
        this.selectedFiles.push(file);
      }
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  openFile(file: any): void {
    this.fileManagerService.triggerDownload(file);
  }
  async uploadFiles() {
    console.log('Selected Files:', this.selectedFiles);
    console.log('Current Path:', this.currentPath);
    if (this.selectedFiles.length === 0) return;

    try {
      // Create a single FormData for all files
      const formData = new FormData();
      
      // Add folderName to FormData
      if(this.currentFolder){
        formData.append('folder_id', this.currentFolder?.id);
      }
      
      // Append each file with a unique key
      Array.from(this.selectedFiles).forEach((file) => {
        formData.append(`files`, file);
      });
      
      // Log the FormData contents
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(key, ':', value.name);
        } else {
          console.log(key, ':', value);
        }
      });
      
      this.store.dispatch(addFile({ 
        formData: formData, file_type: 'file'
      }));
      
      this.closeFileUploadModal();
      // Refresh the file list after upload
     // this.fetchFolders(this.currentFolder);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectFolder(folder: FolderNode, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Deselect all folders
    this.folderList.forEach(f => f.isSelected = false);
    this.folderTree.folders.forEach(f => this.deselectAllFolders(f));

    // Select the clicked folder
    folder.isSelected = true;
    folder.isExpanded = true;

    // Update current path and fetch contents
    this.fetchFolders(folder, event);
  }

  private deselectAllFolders(folder: FolderNode) {
    folder.isSelected = false;
    folder.subFolders?.forEach(f => this.deselectAllFolders(f));
  }
}