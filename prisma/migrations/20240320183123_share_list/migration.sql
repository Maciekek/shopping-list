-- CreateEnum
CREATE TYPE "SharedListType" AS ENUM ('READ', 'WRITE');

-- CreateTable
CREATE TABLE "shareLists" (
    "id" TEXT NOT NULL,
    "type" "SharedListType" NOT NULL,
    "listId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "shareLists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shareLists_listId_key" ON "shareLists"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "shareLists_token_key" ON "shareLists"("token");

-- AddForeignKey
ALTER TABLE "shareLists" ADD CONSTRAINT "shareLists_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
