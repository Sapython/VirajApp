import { Timestamp } from '@angular/fire/firestore';
import { UserConstructor } from './user.structure';
import { Product } from './product.structure';

export interface KotConstructor {
  id?: string;
  createdDate: Timestamp;
  stage: 'active' | 'finalized' | 'cancelled' | 'edit';
  editMode: boolean;
  selected: boolean;
  products: any[];
  allSelected: boolean;
  someSelected: boolean;
  unmade?: boolean;
  cancelReason?: {
    reason: string;
    mode: 'un-made' | 'made';
    time: Timestamp;
    user: UserConstructor;
  };
  user: UserConstructor;
  mode?:
    | 'firstChargeable'
    | 'cancelledKot'
    | 'editedKot'
    | 'runningNonChargeable'
    | 'runningChargeable'
    | 'firstNonChargeable'
    | 'reprintKot'
    | 'online';
}

export interface kotReport extends KotConstructor {
  billNo: string;
  grandTotal: number;
  tokenNo: string;
}

export interface PrintableKot {
  mode:
    | 'firstChargeable'
    | 'cancelledKot'
    | 'editedKot'
    | 'runningNonChargeable'
    | 'runningChargeable'
    | 'firstNonChargeable'
    | 'reprintKot'
    | 'online';
  billingMode: 'dineIn' | 'takeaway' | 'online';
  date: string;
  time: string;
  token: string;
  orderNo: string;
  table: string;
  products: printableKotItem[];
}

export interface printableKotItem {
  id: string;
  name: string;
  instruction: string;
  quantity: number;
  category: any;
  edited?: boolean;
  specificPrinter: string;
}
