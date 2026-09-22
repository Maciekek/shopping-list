-- AlterTable
ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "login_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "login_events_user_id_created_at_idx" ON "login_events"("user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "login_events" ADD CONSTRAINT "login_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
