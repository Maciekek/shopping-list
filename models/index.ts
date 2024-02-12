export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface ListItem {
  uuid: string;
  name: string;
  selected: boolean;
}

export interface List {
  id: number;
  name: string;
  items: ListItem[];
}
