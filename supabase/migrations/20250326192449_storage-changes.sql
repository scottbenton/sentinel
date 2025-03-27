create policy "Dashboard Users with meeting access can write nwsk9y_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'meeting-documents'::text) AND (EXISTS ( SELECT 1
   FROM dashboard_users
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((storage.foldername(objects.name))[1] = (dashboard_users.dashboard_id)::text) AND (dashboard_users.can_manage_meetings = true))))));


create policy "Dashboard Users with meeting access can write nwsk9y_1"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'meeting-documents'::text) AND (EXISTS ( SELECT 1
   FROM dashboard_users
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((storage.foldername(objects.name))[1] = (dashboard_users.dashboard_id)::text) AND (dashboard_users.can_manage_meetings = true))))));


create policy "Dashboard Users with meeting access can write nwsk9y_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'meeting-documents'::text) AND (EXISTS ( SELECT 1
   FROM dashboard_users
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((storage.foldername(objects.name))[1] = (dashboard_users.dashboard_id)::text) AND (dashboard_users.can_manage_meetings = true))))));


create policy "Dashboard users can view nwsk9y_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'meeting-documents'::text) AND (EXISTS ( SELECT 1
   FROM dashboard_users
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND ((storage.foldername(objects.name))[1] = (dashboard_users.dashboard_id)::text))))));



