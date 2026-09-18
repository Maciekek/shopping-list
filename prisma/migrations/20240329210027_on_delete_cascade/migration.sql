-- DropForeignKey
ALTER TABLE "shareLists" DROP CONSTRAINT "shareLists_listId_fkey";

-- AddForeignKey
ALTER TABLE "shareLists" ADD CONSTRAINT "shareLists_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
