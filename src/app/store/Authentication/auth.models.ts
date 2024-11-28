/* eslint-disable @typescript-eslint/no-explicit-any */
import { Translation } from "src/app/core/interfaces/core.interface";
import { City } from "../City/city.model";
import {  Role } from "../Role/role.models";

export class User {
  userId?: string;
  username?: string;
  name?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
  logo?: string;
  status?: string;
  phone?: string;
  user?: _User;
}

export class _User {
 
id?: number;
username?: string;
translation_data?: Translation[];
merchantId?: number;
email?: string;
password?: string;
emailVerifiedAt?: string;
logo?: string;
image?: string;
bankName?: string;
referCount?: string;
totalOrder?: number;
url?: string;
phone?: string;
country?: string;
user?: any;
city_id?: number;
status?: string;
city?: City;
street?: string;
building?: string;
company_registration?: string;
registrationDate?: string;
updatedAt?: string;
companyId?: number;
role?: Role;// the type will be Role
}

