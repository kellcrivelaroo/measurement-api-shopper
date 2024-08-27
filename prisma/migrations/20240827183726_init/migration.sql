-- CreateTable
CREATE TABLE "measures" (
    "id" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "measure_date_time" TIMESTAMP(3) NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("id")
);
