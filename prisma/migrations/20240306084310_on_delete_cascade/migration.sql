-- DropForeignKey
ALTER TABLE "ListsOnUsers" DROP CONSTRAINT "ListsOnUsers_listId_fkey";

-- DropForeignKey
ALTER TABLE "ListsOnUsers" DROP CONSTRAINT "ListsOnUsers_userId_fkey";

-- AddForeignKey
ALTER TABLE "ListsOnUsers" ADD CONSTRAINT "ListsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListsOnUsers" ADD CONSTRAINT "ListsOnUsers_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
