alter table "public"."notifications" drop constraint "notifications_log_id_fkey";

alter table "public"."notifications" alter column "log_id" drop not null;

alter table "public"."notifications" add constraint "notifications_log_id_fkey" FOREIGN KEY (log_id) REFERENCES logs(id) ON UPDATE RESTRICT ON DELETE SET DEFAULT not valid;

alter table "public"."notifications" validate constraint "notifications_log_id_fkey";

ALTER TABLE notifications REPLICA IDENTITY FULL;
