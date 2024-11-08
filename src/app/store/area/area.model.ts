export interface AreaListModel {
    
     id?: number;
     name?: string;
     name_ar?: string;
     country_id?: number;
     status? : string;
     updatedAt? :  string;
     createdAt?: string;

}
export enum Status {

   pending = 1,
   active = 2,
   inactive = 3,
   deleted = 4

  }
