-- AlterTable
ALTER TABLE "ServerInstallation" ALTER COLUMN "errorStatus" DROP NOT NULL,
ALTER COLUMN "errorStatus" DROP DEFAULT;
