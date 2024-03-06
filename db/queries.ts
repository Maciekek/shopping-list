// import { sql } from '@vercel/postgres';
// import { auth } from '@/app/auth';
// import { List, ListItem } from '@/models';
//
// export const getUsersListsQuery = async (email: string) => sql`
//       SELECT "ShoppingList".id, "ShoppingList".name
//       FROM "ShoppingList"
//                JOIN "ShoppingListUsers" ON "ShoppingList".user_id = "ShoppingListUsers".id
//       WHERE "ShoppingListUsers".email = ${email};
//   `;
//
// export const getListByIdQuery = async (listId: number) => {
//   const session = await auth();
//
//   if (!session) {
//     return;
//   }
//
//   const result = await getUserByEmail(session?.user?.email || '');
//
//   return sql`
//       SELECT *
//       FROM "ShoppingList" sl
//                JOIN "ShoppingListUserMapping" slum ON sl.id = slum.shopping_list_id
//                JOIN "ShoppingListUsers" slu ON slum.user_id = slu.id
//       WHERE slu.id = ${result.rows[0].id} AND slum.shopping_list_id = ${listId};
//   `;
// };
//
// export const getSharedListsQuery = async () => {
//   const session = await auth();
//   const result = await getUserByEmail(session?.user?.email || '');
//
//   if (!session) {
//     return;
//   }
//
//   return sql`SELECT sl.id, sl.name, sl.items, sl.user_id
//       FROM "ShoppingList" sl
//                JOIN "ShoppingListUserMapping" slum ON sl.id = slum.shopping_list_id
//                JOIN "ShoppingListUsers" slu ON slum.user_id = slu.id
//       WHERE slu.id = ${result.rows[0].id} AND sl.user_id != ${result.rows[0].id}`;
// };
//
// export const getUserByEmail = async (email: string) => sql`
//     SELECT * FROM "ShoppingListUsers" WHERE "ShoppingListUsers".email = ${email};
// `;
//
// export const isUserByEmailExist = async (email: string) => sql`
//     SELECT EXISTS(SELECT 1 FROM "ShoppingListUsers" WHERE "ShoppingListUsers".email = ${email})
// `;
//
// export const createListQuery = async (list: {
//   name: string | string;
//   items: any[];
// }) => {
//   const session = await auth();
//   const result = await getUserByEmail(session?.user?.email || '');
//
//   if (result.rows[0]) {
//     const newListResult = await sql`
//     insert into "ShoppingList" (name, items, user_id)
//     values (${list.name}, '[]', ${result.rows[0].id})
//         RETURNING id;`;
//
//     return sql`
//     insert into "ShoppingListUserMapping" (shopping_list_id, user_id)
//     values (${newListResult.rows[0].id}, ${result.rows[0].id});`;
//   }
// };
//
// export const updateListQuery = async (listId: number, list: ListItem[]) => {
//   const session = await auth();
//   const result = await getUserByEmail(session?.user?.email || '');
//
//   const items = JSON.stringify(list);
//
//   if (result.rows[0]) {
//     return sql`
//         UPDATE public."ShoppingList"
//         SET items = ${items}
//             FROM "ShoppingListUserMapping" slum
//         JOIN public."ShoppingListUsers" slu ON slum.user_id = slu.id
//             WHERE slum.shopping_list_id = "ShoppingList".id
//           AND slu.id = ${result.rows[0].id} AND "ShoppingList".id = ${listId}
// `;
//   }
// };
//
// export const shareListQuery = async (email: string, listId: number) => {
//   const userToShareWith = await getUserByEmail(email);
//
//   const list = await getListByIdQuery(listId);
//
//   if (userToShareWith.rows.length === 0 || list?.rows.length === 0) {
//     throw new Error('User or list does not exist.');
//   }
//
//   return sql`
//     insert into "ShoppingListUserMapping" (shopping_list_id, user_id)
//     values (${listId}, ${userToShareWith.rows[0].id})
// `;
// };
//
// export const createUserQuery = async (email: string) => {
//   return sql`
//     insert into "ShoppingListUsers" (email, name, username)
//     values (${email}, '', '');
// `;
// };
//
// export const deleteListQuery = async (listId: number) => {
//   const session = await auth();
//   const result = await getUserByEmail(session?.user?.email || '');
//
//   return sql`
//       DELETE FROM "ShoppingList"
//       WHERE id = ${listId}
//         AND user_id = ${result.rows[0].id};
// `;
// };
