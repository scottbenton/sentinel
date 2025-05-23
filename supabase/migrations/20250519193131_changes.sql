alter table "public"."notifications" add column "additional_context" jsonb not null default '{}'::jsonb;

alter table "public"."notifications" add column "has_been_read" boolean not null default false;

create policy "Users can delete their notifications"
on "public"."notifications"
as permissive
for delete
to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));


create policy "Users can read their notifications"
on "public"."notifications"
as permissive
for select
to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));


create policy "Users can update their notifications"
on "public"."notifications"
as permissive
for update
to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)))
with check ((user_id = ( SELECT auth.uid() AS uid)));


CREATE TRIGGER "dashboard-user-invites/delete" AFTER DELETE ON public.dashboard_user_invites FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:3000/webhooks/dashboard-user-invites/delete', 'POST', '{"Content-type":"application/json"}', '{}', '5000');

CREATE TRIGGER "dashboard_user_invites-insert" AFTER INSERT ON public.dashboard_user_invites FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:3000/webhooks/dashboard-user-invites/insert', 'POST', '{"Content-type":"application/json"}', '{}', '5000');

CREATE TRIGGER "users/insert" AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://host.docker.internal:3000/webhooks/users/insert', 'POST', '{"Content-type":"application/json"}', '{}', '5000');


