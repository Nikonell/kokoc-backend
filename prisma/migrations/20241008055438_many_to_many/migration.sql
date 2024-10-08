/*
  Warnings:

  - You are about to drop the `_CartToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CartToProduct" DROP CONSTRAINT "_CartToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartToProduct" DROP CONSTRAINT "_CartToProduct_B_fkey";

-- DropTable
DROP TABLE "_CartToProduct";

-- CreateTable
CREATE TABLE "ProductsOnCart" (
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductsOnCart_pkey" PRIMARY KEY ("cartId","productId")
);

-- AddForeignKey
ALTER TABLE "ProductsOnCart" ADD CONSTRAINT "ProductsOnCart_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnCart" ADD CONSTRAINT "ProductsOnCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
