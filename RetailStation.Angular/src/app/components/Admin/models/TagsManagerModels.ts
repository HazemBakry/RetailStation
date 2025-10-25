export interface Tag {
  tagId: number;
  name: string;
  isActive:boolean;
  
}

export interface Item {
  itemId: number;
  name: string;
  tags?: Tag[];
}