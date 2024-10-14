export interface SectionListModel {
    
     id?: string;
     name?: string;
     status? : string;
     updatedAt? :  string;
     createdAt?: string;

}

export enum Status {

     active = 2,
     inactive = 3,
     deleted = 4
  
    }