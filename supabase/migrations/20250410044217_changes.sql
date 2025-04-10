alter table "public"."organizations" alter column "last_synced" set data type timestamp with time zone using "last_synced"::timestamp with time zone;


