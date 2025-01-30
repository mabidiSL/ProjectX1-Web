/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, skip, take } from 'rxjs/operators';
import { RootReducerState } from 'src/app/store';
import { selectDataFileManager, selectDataLoading, selectStorageQuota } from 'src/app/store/fileManager/file-manager-selector';
import { addFileManagerlist, fetchFileManagerlistData, deleteFileManagerlist, getStorageQuota, addFile } from 'src/app/store/fileManager/file-manager.action';

interface FolderNode {
  name: string;
  path: string;
  isExpanded: boolean;
  isSelected: boolean;
  subFolders?: FolderNode[];
  files?: FileNode[];
}

interface FileNode {
  name: string;
  key: string;
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
    RootFolder$: Observable<string> ;
    storageQuota$: Observable<StorageQuota>;
    
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
    folderTree: FolderNode[] = [];
    currentPath: string = '';
    isRenamingFolder: boolean = false;
    editingFolderName: string = '';
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
      this.currentPath = folderName || '';
      this.showBackButton = !!folderName;
      
      this.store.dispatch(fetchFileManagerlistData({ folderName: folderName }));
      
      this.FolderList$.pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (data) => {
          if (!data?.folders?.length && !data?.files?.length) {
            this.folderTree = [];
            this.folderList = [];
            this.fileList = [];
            return;
          }

          // Process folders for the tree
          const rootFolders = data?.folders?.map(folderPath => {
            const parts = folderPath.split('/');
            const name = parts[parts.length - 1];
            return {
              name,
              path: folderPath,
              isExpanded: folderPath === folderName,
              isSelected: folderPath === folderName,
              subFolders: [],
              files: []
            } as FolderNode;
          }) || [];

          // Update folderList for the current view
          this.folderList = data?.folders?.map(folderPath => ({
            name: folderPath.split('/').pop(),
            path: folderPath
          })) || [];

          // Update fileList
          this.fileList = data?.files?.map(file => ({
            name: file.name.split('/').pop(),
            key: file.Key,
            lastModified: new Date(file.LastModified).toLocaleDateString('en-CA'),
            size: file.Size,
            path: file.name
          })) || [];

          // Initialize or update the folder tree
          if (!folderName) {
            // At root level, set the entire tree
            this.folderTree = rootFolders;
            console.log('INITIAL TREE this.folderTree', this.folderTree);
          } else {
            // Update existing tree with new data
            this.updateFolderTree(folderName, rootFolders, this.fileList);
          }
        },
        error: (error) => {
          console.error('Error fetching folders:', error);
        }
      });
    }

    fetchSubFolders(folderPath: string, event?: Event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.currentPath = folderPath;
      const pathParts = folderPath.split('/').filter(p => p);
      const level = pathParts.length;
      console.log('level in subfolders', level);
      const clickedFolderName = pathParts[pathParts.length - 1];

      // Store parent path for back navigation
      const parentPath = pathParts.slice(0, -1).join('/');
      this.parentFolderPath = parentPath;
      this.showBackButton = true;

      const currentTree = [...this.folderTree];
      console.log('Current tree before update:', currentTree);
      // For all levels, fetch and update the view
      this.store.dispatch(fetchFileManagerlistData({ folderName: folderPath }));

      // Create a new subscription after dispatch
      this.FolderList$.pipe(
        takeUntil(this.destroy$),
        skip(1),
        take(1)
      ).subscribe(data => {
        console.log('data in subfolders after dispatch', data);
        
        if(data) {
          // Process folders for the current level
          const folders = data?.folders?.map(path => {
            const parts = path.split('/');
            const name = parts[parts.length - 1];
            return {
              name,
              path,
              isExpanded: false,
              isSelected: false,
              subFolders: [],
              files: []
            } as FolderNode;
          }) || [];

          // Process files for the current level
          const files = data?.files?.map(file => ({
            name: file.name.split('/').pop(),
            key: file.Key,
            lastModified: new Date(file.LastModified).toLocaleDateString('en-CA'),
            size: file.Size,
            path: file.name
          })) || [];

          // Update the current view lists
          this.folderList = folders;
          this.fileList = files;
          console.log('folder tree  in subfolders', this.folderTree);
          this.folderTree = currentTree;
          // Update the tree structure
          this.updateFolderTree(folderPath, folders, files);

          console.log('Updated folder list:', this.folderList);
          console.log('Updated file list:', this.fileList);
        }
      });
    }

    private updateFolderTree(path: string, newFolders: FolderNode[], newFiles: FileNode[]) {
      console.log('updateFolderTree', {folderTree: this.folderTree, path, newFolders, newFiles });
      
      // Handle both cases where path might or might not have forward slashes
      const pathParts = path ? path.split(/[/\\]/).filter(p => p) : [];
      
      // If empty path, update root level
      if (!path) {
        this.folderTree = newFolders.map(folder => ({
          ...folder,
          isExpanded: false,
          subFolders: [],
          files: []
        }));
        return;
      }

      // If path is just a folder name without slashes (e.g., 'docs')
      if (pathParts.length === 1) {
        // Create a new tree array to avoid mutating the original
        const updatedTree = this.folderTree.length > 0 ? this.folderTree.map(folder => {
          if (folder.name === pathParts[0]) {
            // Return updated folder while preserving its existing properties
            return {
              ...folder,
              subFolders: newFolders,
              files: newFiles,
              isExpanded: true,
              isSelected: true
            };
          }
          // Return other folders unchanged
          return {
            ...folder,
            isSelected: false
          };
        }) : [];

        // If folder doesn't exist in tree, add it
        if (!updatedTree.some(f => f.name === pathParts[0])) {
          updatedTree.push({
            name: pathParts[0],
            path: pathParts[0],
            isExpanded: true,
            isSelected: true,
            subFolders: newFolders,
            files: newFiles
          });
        }

        // Update the tree with the new state
        this.folderTree = updatedTree;
        return;
      }

      // For nested paths, create a new tree with updated structure
      const updateNestedPath = (currentTree: FolderNode[]): FolderNode[] => {
        return currentTree.map(folder => {
          if (folder.name === pathParts[0]) {
            // This is part of our path, recurse into it
            return {
              ...folder,
              isExpanded: true,
              isSelected: pathParts.length === 1,
              subFolders: pathParts.length === 1 ? newFolders : updateNestedPath(folder.subFolders),
              files: pathParts.length === 1 ? newFiles : folder.files
            };
          }
          // This is not part of our path
          return {
            ...folder,
            isSelected: false
          };
        });
      };

      // Update the tree structure
      const updatedTree = updateNestedPath(this.folderTree);
      
      // If the folder doesn't exist at root level, create it
      if (!updatedTree.some(f => f.name === pathParts[0])) {
        const newFolder: FolderNode = {
          name: pathParts[0],
          path: pathParts[0],
          isExpanded: true,
          isSelected: pathParts.length === 1,
          subFolders: pathParts.length === 1 ? newFolders : [],
          files: pathParts.length === 1 ? newFiles : []
        };
        updatedTree.push(newFolder);
      }

      this.folderTree = updatedTree;
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
        console.log('delete File', item);
        
        const isFile = 'key' in item;
        const itemType = isFile ? 'file' : 'folder';
        const confirmDelete = await this.showDeleteConfirmDialog(itemType, item.name);
        
        if (confirmDelete) {
          this.store.dispatch(deleteFileManagerlist({ 
            key: item.path,
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
      //if (newFolderName?.includes('project-x1') && newFolderName.includes('/')) {

      this.store.dispatch(addFileManagerlist({ folderName: newFolderName }));

      // Close the modal after folder creation
      this.closeCreateFolderModal();

      // Optionally, refresh the folder list or fetch subfolders
      //this.fetchSubFolders(this.RootFolder$);
   // }
  }

  toggleFolder(folder: FolderNode, event: Event): void {
    event.stopPropagation();
    const pathParts = folder.path.split('/').filter(p => p);
    const level = pathParts.length;

    // For levels deeper than 2, only update the view
    if (level > 2) {
      this.fetchSubFolders(folder.path);
      return;
    }

    // For levels 1 and 2, handle expansion
    folder.isExpanded = !folder.isExpanded;
    if (!folder.subFolders?.length && folder.isExpanded) {
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

  navigateToParent(): void {
    if (this.currentPath) {
      const parts = this.currentPath.split('/');
      parts.pop();
      const parentPath = parts.join('/');
      this.fetchFolders(parentPath || null);
    }
  }

  openFileUploadModal(folderPath?: string) {
   // this.currentPath = folderPath;
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

  async uploadFiles() {
    console.log('Selected Files:', this.selectedFiles);
    console.log('Current Path:', this.currentPath);
    if (this.selectedFiles.length === 0) return;

    try {
      // Create a single FormData for all files
      const formData = new FormData();
      
      // Add folderName to FormData
      formData.append('folderName', this.currentPath || '');
      
      // Append each file with a unique key
      Array.from(this.selectedFiles).forEach((file, index) => {
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
        formData: formData
      }));
      
      this.closeFileUploadModal();
      // Refresh the file list after upload
      this.fetchSubFolders(this.currentPath);
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
    this.folderTree.forEach(f => this.deselectAllFolders(f));

    // Select the clicked folder
    folder.isSelected = true;
    folder.isExpanded = true;

    // Update current path and fetch contents
    this.fetchFolders(folder.path);
  }

  private deselectAllFolders(folder: FolderNode) {
    folder.isSelected = false;
    folder.subFolders?.forEach(f => this.deselectAllFolders(f));
  }
}