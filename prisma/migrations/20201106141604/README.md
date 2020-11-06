# Migration `20201106141604`

This migration has been generated by Gál Péter at 11/6/2020, 3:16:04 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `accounts` (
`id` int  NOT NULL  AUTO_INCREMENT,
`compound_id` varchar(191)  NOT NULL ,
`user_id` int  NOT NULL ,
`provider_type` varchar(191)  NOT NULL ,
`provider_id` varchar(191)  NOT NULL ,
`provider_account_id` varchar(191)  NOT NULL ,
`refresh_token` varchar(191)  ,
`access_token` varchar(191)  ,
`access_token_expires` datetime(3)  ,
`created_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updated_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `accounts.compound_id_unique`(`compound_id`),
INDEX `providerAccountId`(`provider_account_id`),
INDEX `providerId`(`provider_id`),
INDEX `userId`(`user_id`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `sessions` (
`id` int  NOT NULL  AUTO_INCREMENT,
`user_id` int  NOT NULL ,
`expires` datetime(3)  NOT NULL ,
`session_token` varchar(191)  NOT NULL ,
`access_token` varchar(191)  NOT NULL ,
`created_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updated_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `sessions.session_token_unique`(`session_token`),
UNIQUE INDEX `sessions.access_token_unique`(`access_token`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `users` (
`id` int  NOT NULL  AUTO_INCREMENT,
`name` varchar(191)  ,
`email` varchar(191)  ,
`email_verified` datetime(3)  ,
`image` varchar(191)  ,
`created_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updated_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `users.email_unique`(`email`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Teacher` (
`userid` int  NOT NULL ,
PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Student` (
`userid` int  NOT NULL ,
`tableId` int  ,
PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Table` (
`id` int  NOT NULL  AUTO_INCREMENT,
`name` varchar(191)  NOT NULL ,
`teacherId` int  NOT NULL ,
`iconid` int  ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `TaskCompletion` (
`userid` int  NOT NULL ,
`taskid` int  NOT NULL ,
PRIMARY KEY (`userid`,`taskid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `BadgeCompletion` (
`userid` int  NOT NULL ,
`badgeid` int  NOT NULL ,
PRIMARY KEY (`userid`,`badgeid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Task` (
`id` int  NOT NULL  AUTO_INCREMENT,
`name` varchar(191)  ,
`points` int  NOT NULL ,
`endsAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`tableId` int  ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Badge` (
`id` int  NOT NULL  AUTO_INCREMENT,
`name` varchar(191)  ,
`imageid` int  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Image` (
`id` int  NOT NULL  AUTO_INCREMENT,
`width` int  NOT NULL ,
`height` int  NOT NULL ,
`path` varchar(191)  NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `Invitations` (
`id` int  NOT NULL  AUTO_INCREMENT,
`studentid` int  NOT NULL ,
`tableid` int  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `verification_requests` (
`id` int  NOT NULL  AUTO_INCREMENT,
`identifier` varchar(191)  NOT NULL ,
`token` varchar(191)  NOT NULL ,
`expires` datetime(3)  NOT NULL ,
`created_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updated_at` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `verification_requests.token_unique`(`token`),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `Teacher` ADD FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Student` ADD FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Student` ADD FOREIGN KEY (`tableId`) REFERENCES `Table`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `Table` ADD FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Table` ADD FOREIGN KEY (`iconid`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `TaskCompletion` ADD FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `TaskCompletion` ADD FOREIGN KEY (`taskid`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `BadgeCompletion` ADD FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `BadgeCompletion` ADD FOREIGN KEY (`badgeid`) REFERENCES `Badge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Task` ADD FOREIGN KEY (`tableId`) REFERENCES `Table`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `Badge` ADD FOREIGN KEY (`imageid`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Invitations` ADD FOREIGN KEY (`studentid`) REFERENCES `Student`(`userid`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Invitations` ADD FOREIGN KEY (`tableid`) REFERENCES `Table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201105081856..20201106141604
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -53,12 +53,81 @@
   @@map(name: "users")
 }
+model Teacher {
+  userid            Int       @id
+  user              User      @relation(references: [id], fields: [userid])
+}
+
+model Student {
+  userid            Int       @id
+  user              User      @relation(references: [id], fields: [userid])
+}
+
+model Table {
+  id            Int          @default(autoincrement()) @id
+  name          String
+  teacherId     Int
+  teacher       Teacher      @relation(references: [userid], fields: [teacherId])
+  students      Student[]
+  iconid        Int?
+  icon          Image?       @relation(references: [id], fields: [iconid])
+  task          Task[]
+}
+
+model TaskCompletion {
+  userid        Int
+  user          User         @relation(references: [id], fields: [userid])
+  taskid        Int
+  task          Task         @relation(references: [id], fields: [taskid])
+
+  @@id([userid, taskid])
+}
+
+model BadgeCompletion {
+  userid        Int
+  user          User         @relation(references: [id], fields: [userid])
+  badgeid       Int
+  badge         Badge        @relation(references: [id], fields: [badgeid])
+
+  @@id([userid, badgeid])
+}
+
+model Task {
+  id            Int          @default(autoincrement()) @id
+  name          String?
+  points        Int
+  endsAt        DateTime     @default(now())
+}
+
+model Badge {
+  id            Int          @default(autoincrement()) @id
+  name          String?
+  imageid       Int
+  image         Image        @relation(references: [id], fields: [imageid])
+}
+
+model Image {
+  id            Int          @default(autoincrement()) @id
+  width         Int
+  height        Int
+  path          String
+}
+
+model Invitations {
+  id            Int       @default(autoincrement()) @id
+  studentid     Int
+  student       Student   @relation(references: [userid], fields: [studentid])
+  tableid       Int
+  table         Table     @relation(references: [id], fields: [tableid])
+  createdAt     DateTime  @default(now())
+}
+
 model VerificationRequest {
-  id         Int      @default(autoincrement()) @id
+  id         Int       @default(autoincrement()) @id
   identifier String
-  token      String   @unique
+  token      String    @unique
   expires    DateTime
   createdAt  DateTime  @default(now()) @map(name: "created_at")
   updatedAt  DateTime  @default(now()) @map(name: "updated_at")
@@ -77,5 +146,5 @@
   errors             String
   started_at         DateTime
   finished_at        DateTime?
   @@map("_migration")
-}
+}
```

