create policy "Dashboard meeting admins can update documents"
on "public"."meeting_documents"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_documents.meeting_id) AND (dashboard_users.can_manage_meetings = true)))))
with check ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_documents.meeting_id) AND (dashboard_users.can_manage_meetings = true)))));


create policy "Dashboard users can read documents"
on "public"."meeting_documents"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_documents.meeting_id)))));


create policy "Dashboard users can delete their own comments"
on "public"."meeting_logs"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_logs.meeting_id) AND (meeting_logs.created_by = ( SELECT auth.uid() AS uid)) AND (meeting_logs.type = 'comment'::meeting_log_types)))));


create policy "Dashboard users can insert logs"
on "public"."meeting_logs"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_logs.meeting_id) AND (meeting_logs.created_by = ( SELECT auth.uid() AS uid))))));


create policy "Dashboard users can select meeting logs"
on "public"."meeting_logs"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_logs.meeting_id)))));


create policy "Dashboard users can update their own comments"
on "public"."meeting_logs"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_logs.meeting_id) AND (meeting_logs.created_by = ( SELECT auth.uid() AS uid)) AND (meeting_logs.type = 'comment'::meeting_log_types)))))
with check ((EXISTS ( SELECT 1
   FROM ((dashboard_users
     JOIN organizations ON ((organizations.dashboard_id = dashboard_users.dashboard_id)))
     JOIN meetings ON ((meetings.organization_id = organizations.id)))
  WHERE ((dashboard_users.user_id = ( SELECT auth.uid() AS uid)) AND (meetings.id = meeting_logs.meeting_id) AND (meeting_logs.created_by = ( SELECT auth.uid() AS uid)) AND (meeting_logs.type = 'comment'::meeting_log_types)))));



