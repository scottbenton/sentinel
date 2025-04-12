drop policy "Users with management access can delete dashboard_users" on "public"."dashboard_users";

drop policy "Users with management access can update dashboard_users" on "public"."dashboard_users";

drop policy "Authenticated Users can read the Users Table" on "public"."users";

alter table "public"."users" add column "email_address" text;

create policy "Users with management access can delete dashboard_users"
on "public"."dashboard_users"
as permissive
for delete
to authenticated
using ((( SELECT (auth.uid() = dashboard_users.user_id)) OR (EXISTS ( SELECT 1
   FROM dashboard_users du
  WHERE ((du.user_id = ( SELECT auth.uid() AS uid)) AND (du.dashboard_id = dashboard_users.dashboard_id) AND (du.is_admin = true))))));


create policy "Users with management access can update dashboard_users"
on "public"."dashboard_users"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM dashboard_users du
  WHERE ((du.user_id = ( SELECT auth.uid() AS uid)) AND (du.dashboard_id = dashboard_users.dashboard_id) AND (du.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM dashboard_users du
  WHERE ((du.user_id = ( SELECT auth.uid() AS uid)) AND (du.dashboard_id = dashboard_users.dashboard_id) AND (du.is_admin = true)))));


create policy "Authenticated Users can read the Users Table"
on "public"."users"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = id) OR (EXISTS ( SELECT 1
   FROM (dashboard_users du1
     JOIN dashboard_users du2 ON ((du1.dashboard_id = du2.dashboard_id)))
  WHERE ((du1.user_id = users.id) AND (du2.user_id = ( SELECT auth.uid() AS uid)))))));



