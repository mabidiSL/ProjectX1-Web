import { Claim } from "src/app/store/Role/role.models";

export interface MenuItem {
    id?: number;
    label?: string;
    icon?: string;
    link?: string;
    subItems?: MenuItem[];
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    isLayout?: boolean;
    claims?: Claim[];
}
