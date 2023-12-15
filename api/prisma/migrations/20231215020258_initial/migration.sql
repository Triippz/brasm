-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "InstallationStatus" AS ENUM ('INSTALLATION_IN_PROGRESS', 'ERROR', 'FINISHED');

-- CreateEnum
CREATE TYPE "ServerType" AS ENUM ('ARMA_REFORGER');

-- CreateEnum
CREATE TYPE "ErrorStatus" AS ENUM ('WRONG_AUTH', 'IO', 'TIMEOUT', 'NO_MATCH', 'NO_SUBSCRIPTION', 'RATE_LIMIT', 'GENERIC', 'INTERRUPTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReforgerServer" (
    "id" SERIAL NOT NULL,
    "dedicatedServerId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "thirdPersonViewEnabled" BOOLEAN NOT NULL DEFAULT true,
    "battlEye" BOOLEAN NOT NULL DEFAULT true,
    "serverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReforgerServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReforgerServerActiveMods" (
    "modId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "reforgerServerId" INTEGER NOT NULL,

    CONSTRAINT "ReforgerServerActiveMods_pkey" PRIMARY KEY ("reforgerServerId","modId")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "type" "ServerType" NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "queryPort" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "password" TEXT,
    "adminPassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerInstallation" (
    "id" SERIAL NOT NULL,
    "type" "ServerType" NOT NULL,
    "version" TEXT,
    "lastUpdatedAt" TIMESTAMP(3),
    "installationStatus" "InstallationStatus" NOT NULL DEFAULT 'INSTALLATION_IN_PROGRESS',
    "errorStatus" "ErrorStatus" NOT NULL DEFAULT 'GENERIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SteamAuth" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "steamGuardToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SteamAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");

-- AddForeignKey
ALTER TABLE "ReforgerServer" ADD CONSTRAINT "ReforgerServer_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReforgerServerActiveMods" ADD CONSTRAINT "ReforgerServerActiveMods_reforgerServerId_fkey" FOREIGN KEY ("reforgerServerId") REFERENCES "ReforgerServer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
