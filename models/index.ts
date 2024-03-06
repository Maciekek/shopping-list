export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
}

export type ListItem = {
  uuid: string;
  name: string;
  selected: boolean;
}

export type List = {
  id: number;
  name: string;
  items: ListItem[];
}


