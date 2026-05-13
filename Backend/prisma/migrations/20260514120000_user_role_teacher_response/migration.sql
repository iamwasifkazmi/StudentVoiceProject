-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'teacher');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'student';
ALTER TABLE "users" ADD COLUMN "anonymous_mode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "push_notifications_enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "feedback" ADD COLUMN "teacher_response" TEXT;
ALTER TABLE "feedback" ADD COLUMN "teacher_response_at" TIMESTAMP(3);
