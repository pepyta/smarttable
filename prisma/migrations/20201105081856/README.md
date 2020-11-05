# Migration `20201105081856`

This migration has been generated at 11/5/2020, 9:18:56 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201105081856
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,81 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "mysql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Account {
+  id                 Int       @default(autoincrement()) @id
+  compoundId         String    @unique @map(name: "compound_id")
+  userId             Int       @map(name: "user_id")
+  providerType       String    @map(name: "provider_type")
+  providerId         String    @map(name: "provider_id")
+  providerAccountId  String    @map(name: "provider_account_id")
+  refreshToken       String?   @map(name: "refresh_token")
+  accessToken        String?   @map(name: "access_token")
+  accessTokenExpires DateTime? @map(name: "access_token_expires")
+  createdAt          DateTime  @default(now()) @map(name: "created_at")
+  updatedAt          DateTime  @default(now()) @map(name: "updated_at")
+
+  @@index([providerAccountId], name: "providerAccountId")
+  @@index([providerId], name: "providerId")
+  @@index([userId], name: "userId")
+
+  @@map(name: "accounts")
+}
+
+model Session {
+  id           Int      @default(autoincrement()) @id
+  userId       Int      @map(name: "user_id")
+  expires      DateTime
+  sessionToken String   @unique @map(name: "session_token")
+  accessToken  String   @unique @map(name: "access_token")
+  createdAt    DateTime @default(now()) @map(name: "created_at")
+  updatedAt    DateTime @default(now()) @map(name: "updated_at")
+
+  @@map(name: "sessions")
+}
+
+model User {
+  id            Int       @default(autoincrement()) @id
+  name          String?
+  email         String?   @unique
+  emailVerified DateTime? @map(name: "email_verified")
+  image         String?
+  createdAt     DateTime  @default(now()) @map(name: "created_at")
+  updatedAt     DateTime  @default(now()) @map(name: "updated_at")
+
+  @@map(name: "users")
+}
+
+model VerificationRequest {
+  id         Int      @default(autoincrement()) @id
+  identifier String
+  token      String   @unique
+  expires    DateTime
+  createdAt  DateTime  @default(now()) @map(name: "created_at")
+  updatedAt  DateTime  @default(now()) @map(name: "updated_at")
+
+  @@map(name: "verification_requests")
+}
+
+model migration {
+  revision           Int       @default(autoincrement()) @id
+  name               String
+  datamodel          String
+  status             String
+  applied            Int
+  rolled_back        Int
+  datamodel_steps    String
+  database_migration String
+  errors             String
+  started_at         DateTime
+  finished_at        DateTime?
+  @@map("_migration")
+}
```

