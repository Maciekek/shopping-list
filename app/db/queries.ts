import { sql } from '@vercel/postgres';
import { auth } from '../auth';
import { List } from '../models';

export const getUsersListsQuery = async (email: string) => sql`
      SELECT "ShoppingList".id, "ShoppingList".name
      FROM "ShoppingList"
               JOIN "ShoppingListUsers" ON "ShoppingList".user_id = "ShoppingListUsers".id
      WHERE "ShoppingListUsers".email = ${email};
  `;

export const getListByIdQuery = async (email: string, listId: number) => sql`
      SELECT "ShoppingList".id, "ShoppingList".name, "ShoppingList".items 
      FROM "ShoppingList"
               JOIN "ShoppingListUsers" ON "ShoppingList".user_id = "ShoppingListUsers".id
      WHERE "ShoppingListUsers".email = ${email} AND "ShoppingList".id = ${listId};
  `;

export const getUserByEmail = async (email: string) => sql`
    SELECT * FROM "ShoppingListUsers" WHERE "ShoppingListUsers".email = ${email};
`;

export const isUserByEmailExist = async (email: string) => sql`
    SELECT EXISTS(SELECT 1 FROM "ShoppingListUsers" WHERE "ShoppingListUsers".email = ${email})
`;

export const createListQuery = async (
  list: { name: string | string; items: any[] },
  userId: number
) => {
  const session = await auth();
  const result = await getUserByEmail(session?.user?.email || '');

  if (result.rows[0]) {
    return sql`
    insert into "ShoppingList" (name, items, user_id)
    values (${list.name}, ${list.items as any}, ${result.rows[0].id});`;
  }
};

export const updateListQuery = async (
  listId: number,
  list: List
) => {
  const session = await auth();
  const result = await getUserByEmail(session?.user?.email || '');

  const a = `{${list.items.join(',')}}`
  console.log(54, a)
  if (result.rows[0]) {
    return sql`
        UPDATE "ShoppingList"
        SET items = ${a}
        WHERE user_id = ${result.rows[0].id} AND id = ${listId};`;
  }
};


export const createUserQuery = async (email: string) => {
  sql`
    insert into "ShoppingListUsers" (email, name, username)
    values (${email}, '', '');
`;
};
