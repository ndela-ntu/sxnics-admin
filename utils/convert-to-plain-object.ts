import { IShopItem } from '@/app/models/shop-item';
import { Document } from 'mongoose';

// Utility function to convert an array of Mongoose documents to plain objects
export default function convertDocumentsToShopItems(docs: Document[]): IShopItem[] {
    return docs.map(doc => doc.toObject({ virtuals: true }) as IShopItem);
  }