-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postageAt" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
