create policy "Dashboard users can select meetings related to their dashboard"
on "public"."meetings"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (dashboard_users
     JOIN organizations ON ((organizations.id = meetings.organization_id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (dashboard_users.dashboard_id = organizations.dashboard_id)))));


create policy "Meeting Managers can do anything"
on "public"."meetings"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM (dashboard_users
     JOIN organizations ON ((organizations.id = meetings.organization_id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (dashboard_users.dashboard_id = organizations.dashboard_id) AND (dashboard_users.can_manage_meetings = true)))))
with check ((EXISTS ( SELECT 1
   FROM (dashboard_users
     JOIN organizations ON ((organizations.id = meetings.organization_id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (dashboard_users.dashboard_id = organizations.dashboard_id) AND (dashboard_users.can_manage_meetings = true)))));



