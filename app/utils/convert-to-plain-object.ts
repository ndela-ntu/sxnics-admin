import { IBlogPost } from "@/app/models/blog-post";
import { IShopItem } from "@/app/models/shop-item";
import { ITrack } from "@/app/models/track";
import { Document } from "mongoose";

export function convertDocumentsToShopItems(docs: Document[]): IShopItem[] {
  return docs.map((doc) => doc.toObject({ virtuals: true }) as IShopItem);
}

export function convertDocumentsToTracks(docs: Document[]): ITrack[] {
  return docs.map((doc) => doc.toObject({ virtuals: true }) as ITrack);
}

export function convertDocumentsToBlogPost(docs: Document[]): IBlogPost[] {
  return docs.map((doc) => doc.toObject({ virtuals: true }) as IBlogPost);
}

export function convertDocumentToTrack(doc: Document): ITrack {
  return  doc.toObject({ virtuals: true }) as ITrack;
}

