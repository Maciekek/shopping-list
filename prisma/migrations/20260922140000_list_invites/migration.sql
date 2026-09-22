-- CreateTable
CREATE TABLE "list_invites" (
    "id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "list_invites_email_idx" ON "list_invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "list_invites_list_id_email_key" ON "list_invites"("list_id", "email");

-- AddForeignKey
ALTER TABLE "list_invites" ADD CONSTRAINT "list_invites_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
