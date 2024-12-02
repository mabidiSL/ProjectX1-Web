import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface LogListModel  extends PaginateModel
{   
    data?: Log[]; 
}
export class Log{
  id?: number ;
  translation_data?: Translation[];
  actionDate?: string ;
  ipAdress?: string;
  user_id?: number;
  status ?: string;
}
