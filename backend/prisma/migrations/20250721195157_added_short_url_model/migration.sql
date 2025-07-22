-- CreateTable
CREATE TABLE "shorturls" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "shorturls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shorturls_fullUrl_key" ON "shorturls"("fullUrl");

-- CreateIndex
CREATE UNIQUE INDEX "shorturls_shortUrl_key" ON "shorturls"("shortUrl");

-- AddForeignKey
ALTER TABLE "shorturls" ADD CONSTRAINT "shorturls_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
