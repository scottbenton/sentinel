drop policy "Dashboard users can delete their own comments" on "public"."meeting_logs";

drop policy "Dashboard users can insert logs" on "public"."meeting_logs";

drop policy "Dashboard users can select meeting logs" on "public"."meeting_logs";

drop policy "Dashboard users can update their own comments" on "public"."meeting_logs";

revoke delete on table "public"."meeting_logs" from "anon";

revoke insert on table "public"."meeting_logs" from "anon";

revoke references on table "public"."meeting_logs" from "anon";

revoke select on table "public"."meeting_logs" from "anon";

revoke trigger on table "public"."meeting_logs" from "anon";

revoke truncate on table "public"."meeting_logs" from "anon";

revoke update on table "public"."meeting_logs" from "anon";

revoke delete on table "public"."meeting_logs" from "authenticated";

revoke insert on table "public"."meeting_logs" from "authenticated";

revoke references on table "public"."meeting_logs" from "authenticated";

revoke select on table "public"."meeting_logs" from "authenticated";

revoke trigger on table "public"."meeting_logs" from "authenticated";

revoke truncate on table "public"."meeting_logs" from "authenticated";

revoke update on table "public"."meeting_logs" from "authenticated";

revoke delete on table "public"."meeting_logs" from "service_role";

revoke insert on table "public"."meeting_logs" from "service_role";

revoke references on table "public"."meeting_logs" from "service_role";

revoke select on table "public"."meeting_logs" from "service_role";

revoke trigger on table "public"."meeting_logs" from "service_role";

revoke truncate on table "public"."meeting_logs" from "service_role";

revoke update on table "public"."meeting_logs" from "service_role";

alter table "public"."meeting_logs" drop constraint "meeting_logs_created_by_fkey";

alter table "public"."meeting_logs" drop constraint "meeting_logs_meeting_id_fkey";

alter table "public"."meeting_logs" drop constraint "meeting_logs_pkey";

drop index if exists "public"."meeting_logs_created_by_idx";

drop index if exists "public"."meeting_logs_meeting_id_idx";

drop index if exists "public"."meeting_logs_pkey";

drop table "public"."meeting_logs";

alter type "public"."meeting_log_types" rename to "meeting_log_types__old_version_to_be_dropped";

create type "public"."meeting_log_types" as enum ('lifecycle', 'comment', 'meeting_created', 'meeting_document_added', 'meeting_document_deleted', 'meeting_name_changed', 'meeting_date_changed', 'meeting_deleted');

create table "public"."logs" (
    "id" bigint generated by default as identity not null,
    "meeting_id" bigint,
    "text" text,
    "is_bot_action" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "type" meeting_log_types not null,
    "org_id" bigint,
    "edited_at" timestamp with time zone,
    "additional_context" jsonb not null default '{}'::jsonb
);


alter table "public"."logs" enable row level security;

drop type "public"."meeting_log_types__old_version_to_be_dropped";

CREATE INDEX meeting_logs_created_by_idx ON public.logs USING btree (created_by);

CREATE INDEX meeting_logs_meeting_id_idx ON public.logs USING btree (meeting_id);

CREATE UNIQUE INDEX meeting_logs_pkey ON public.logs USING btree (id);

alter table "public"."logs" add constraint "meeting_logs_pkey" PRIMARY KEY using index "meeting_logs_pkey";

alter table "public"."logs" add constraint "logs_org_id_fkey" FOREIGN KEY (org_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."logs" validate constraint "logs_org_id_fkey";

alter table "public"."logs" add constraint "meeting_logs_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."logs" validate constraint "meeting_logs_created_by_fkey";

alter table "public"."logs" add constraint "meeting_logs_meeting_id_fkey" FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."logs" validate constraint "meeting_logs_meeting_id_fkey";

grant delete on table "public"."logs" to "anon";

grant insert on table "public"."logs" to "anon";

grant references on table "public"."logs" to "anon";

grant select on table "public"."logs" to "anon";

grant trigger on table "public"."logs" to "anon";

grant truncate on table "public"."logs" to "anon";

grant update on table "public"."logs" to "anon";

grant delete on table "public"."logs" to "authenticated";

grant insert on table "public"."logs" to "authenticated";

grant references on table "public"."logs" to "authenticated";

grant select on table "public"."logs" to "authenticated";

grant trigger on table "public"."logs" to "authenticated";

grant truncate on table "public"."logs" to "authenticated";

grant update on table "public"."logs" to "authenticated";

grant delete on table "public"."logs" to "service_role";

grant insert on table "public"."logs" to "service_role";

grant references on table "public"."logs" to "service_role";

grant select on table "public"."logs" to "service_role";

grant trigger on table "public"."logs" to "service_role";

grant truncate on table "public"."logs" to "service_role";

grant update on table "public"."logs" to "service_role";

create policy "Dashboard users can delete their own comments"
on "public"."logs"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     LEFT JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((organizations.id = logs.org_id) OR ((logs.meeting_id IS NOT NULL) AND (meetings.id = logs.meeting_id))) AND (logs.created_by = ( SELECT auth.uid() AS uid)) AND (logs.type = 'comment'::meeting_log_types)))));


create policy "Dashboard users can insert logs"
on "public"."logs"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     LEFT JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((organizations.id = logs.org_id) OR ((logs.meeting_id IS NOT NULL) AND (meetings.id = logs.meeting_id)))))));


create policy "Dashboard users can select meeting logs"
on "public"."logs"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     LEFT JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((organizations.id = logs.org_id) OR ((logs.meeting_id IS NOT NULL) AND (meetings.id = logs.meeting_id)))))));


create policy "Dashboard users can update their own comments"
on "public"."logs"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     LEFT JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((organizations.id = logs.org_id) OR ((logs.meeting_id IS NOT NULL) AND (meetings.id = logs.meeting_id))) AND (logs.created_by = ( SELECT auth.uid() AS uid)) AND (logs.type = 'comment'::meeting_log_types)))))
with check ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     LEFT JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((organizations.id = logs.org_id) OR ((logs.meeting_id IS NOT NULL) AND (meetings.id = logs.meeting_id))) AND (logs.created_by = ( SELECT auth.uid() AS uid)) AND (logs.type = 'comment'::meeting_log_types)))));



