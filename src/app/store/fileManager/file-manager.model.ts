/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel } from  'src/app/core/interfaces/core.interface' ;

export interface FileManagerListModel  extends PaginateModel
{   
    result?: FileManager; 
}
export interface FileManager {
    
   folders?: any[]; 
   files?: any[];
       
    }
export interface Folder {
        id?: number;
        name?: string;
        date?: string;
        size?: string;
        actions?: string;
    }
         