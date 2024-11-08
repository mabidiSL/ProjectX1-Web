export interface CityListModel {
    
     id?: number;
     name?: string;
     name_ar?: string;
     country_id?: number;
     area_id?: number;
     latitude?: string;
     longitude?: string;
     status? : string;
     updatedAt? :  string;
     createdAt?: string;

}

export enum Status {

     active = 2,
     inactive = 3,
     deleted = 4
  
    }