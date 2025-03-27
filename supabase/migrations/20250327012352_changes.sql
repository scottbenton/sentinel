alter publication supabase_realtime add table dashboard_user_invites;
alter publication supabase_realtime add table dashboard_users;
alter publication supabase_realtime add table dashboards;
alter publication supabase_realtime add table meeting_logs;
alter publication supabase_realtime add table meeting_documents;
alter publication supabase_realtime add table meetings;
alter publication supabase_realtime add table organizations;
alter publication supabase_realtime add table users;

ALTER TABLE dashboard_user_invites REPLICA IDENTITY FULL;
