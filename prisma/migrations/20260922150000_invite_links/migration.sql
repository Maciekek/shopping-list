-- Existing rows (if any) get a random token and a 30-day expiry.
ALTER TABLE "list_invites"
    ALTER COLUMN "email" DROP NOT NULL,
    ADD COLUMN "token" TEXT,
    ADD COLUMN "expires_at" TIMESTAMP(3),
    ADD COLUMN "uses" INTEGER NOT NULL DEFAULT 0;

UPDATE "list_invites"
SET "token" = md5(random()::text || clock_timestamp()::text || "id"),
    "expires_at" = "created_at" + INTERVAL '30 days';

ALTER TABLE "list_invites"
    ALTER COLUMN "token" SET NOT NULL,
    ALTER COLUMN "expires_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "list_invites_token_key" ON "list_invites"("token");
