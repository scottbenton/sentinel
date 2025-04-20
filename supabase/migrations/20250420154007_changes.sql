CREATE INDEX dashboard_user_invites_dashboard_id_email_address_idx ON public.dashboard_user_invites USING btree (dashboard_id, email_address);

CREATE INDEX dashboard_user_invites_dashboard_id_idx ON public.dashboard_user_invites USING btree (dashboard_id);

CREATE INDEX dashboard_user_invites_invited_by_idx ON public.dashboard_user_invites USING btree (invited_by);

CREATE INDEX dashboard_users_user_id_dashboard_id_can_manage_meetings_idx ON public.dashboard_users USING btree (user_id, dashboard_id, can_manage_meetings);

CREATE INDEX dashboard_users_user_id_dashboard_id_can_manage_users_idx ON public.dashboard_users USING btree (user_id, dashboard_id, can_manage_users);

CREATE INDEX dashboard_users_user_id_dashboard_id_is_admin_idx ON public.dashboard_users USING btree (user_id, dashboard_id, is_admin);

CREATE INDEX meeting_documents_created_by_idx ON public.meeting_documents USING btree (created_by);

CREATE INDEX meeting_documents_meeting_id_file_hash_idx ON public.meeting_documents USING btree (meeting_id, file_hash);

CREATE INDEX meeting_documents_meeting_id_filename_idx ON public.meeting_documents USING btree (meeting_id, filename);

CREATE INDEX meeting_documents_meeting_id_idx ON public.meeting_documents USING btree (meeting_id);

CREATE INDEX meeting_logs_created_by_idx ON public.meeting_logs USING btree (created_by);

CREATE INDEX meeting_logs_meeting_id_idx ON public.meeting_logs USING btree (meeting_id);

CREATE INDEX meetings_created_by_idx ON public.meetings USING btree (created_by);

CREATE INDEX meetings_organization_id_idx ON public.meetings USING btree (organization_id);

CREATE INDEX meetings_organization_id_meeting_date_idx ON public.meetings USING btree (organization_id, meeting_date);

CREATE INDEX meetings_organization_id_name_meeting_date_idx ON public.meetings USING btree (organization_id, name, meeting_date);

CREATE INDEX organizations_dashboard_id_idx ON public.organizations USING btree (dashboard_id);


