import { Timestamp } from '@angular/fire/firestore';

export type TableConstructor = {
  id: string;
  tableNo: number;
  bill: any;
  maxOccupancy: string;
  name: string;
  timeSpent: string;
  minutes: number;
  group: string;
  order: number;
  occupiedStart: Timestamp;
  billPrice: number;
  completed?: boolean;
  status: 'available' | 'occupied';
  type: 'table' | 'room' | 'token' | 'online';
};
