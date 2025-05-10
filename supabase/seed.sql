SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '10c97f59-7140-4e8b-ba7c-dde4575bdc77', 'authenticated', 'authenticated', 'inviter@scottbenton.dev', '$2a$10$HBXhCXX7LBpzn6NYS.Lae.IrRQQirwgdQzPfn4/dZ05CG/LLAx9ry', '2025-04-21 01:46:13.782052+00', NULL, '', NULL, '', '2025-04-21 01:46:13.792297+00', '', '', NULL, '2025-04-21 01:46:21.399711+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "10c97f59-7140-4e8b-ba7c-dde4575bdc77", "email": "inviter@scottbenton.dev", "email_verified": true, "phone_verified": false}', NULL, '2025-04-21 01:46:13.777707+00', '2025-04-21 01:46:21.401438+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '96d7c931-d72c-4357-adcb-23c2a35c9c2a', 'authenticated', 'authenticated', 'meeting-editor@scottbenton.dev', '$2a$10$Bq0OU3P.zkt8Zl/G2cFI0uRrzbAFVPgx3iMC7TCN4rkkqQCh0NMMy', '2025-04-21 01:47:19.43667+00', NULL, '', NULL, '', '2025-04-21 01:47:19.442944+00', '', '', NULL, '2025-04-21 01:47:26.640919+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "96d7c931-d72c-4357-adcb-23c2a35c9c2a", "email": "meeting-editor@scottbenton.dev", "email_verified": true, "phone_verified": false}', NULL, '2025-04-21 01:47:19.432902+00', '2025-04-21 01:47:26.642503+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', 'authenticated', 'authenticated', 'admin@scottbenton.dev', '$2a$10$TGPOOQl9pAa5JQ313tHPbep4HhIvk.SYPouf8uv1QX0k5sqBx0fHi', '2025-04-21 01:38:54.395736+00', NULL, '', NULL, '', '2025-04-21 01:38:54.407667+00', '', '', NULL, '2025-04-21 01:39:06.596935+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "309d645d-e4e2-43a5-8d07-ae1a8e8ee79d", "email": "admin@scottbenton.dev", "email_verified": true, "phone_verified": false}', NULL, '2025-04-21 01:38:54.380553+00', '2025-04-21 11:39:24.605757+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '8cf2419c-1371-4bba-b186-5790307ac70c', 'authenticated', 'authenticated', 'viewer@scottbenton.dev', '$2a$10$RMOC07GvULWgA7SmpHpx2uv9azaCvyAuMp7uZZ7sZzDeYYVGdJvou', '2025-04-21 01:47:41.998679+00', NULL, '', NULL, '', '2025-04-21 01:47:42.004379+00', '', '', NULL, '2025-04-21 01:47:47.194067+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8cf2419c-1371-4bba-b186-5790307ac70c", "email": "viewer@scottbenton.dev", "email_verified": true, "phone_verified": false}', NULL, '2025-04-21 01:47:41.994776+00', '2025-04-21 02:41:35.431779+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', '{"sub": "309d645d-e4e2-43a5-8d07-ae1a8e8ee79d", "email": "admin@scottbenton.dev", "email_verified": false, "phone_verified": false}', 'email', '2025-04-21 01:38:54.393343+00', '2025-04-21 01:38:54.393368+00', '2025-04-21 01:38:54.393368+00', '7a9b7105-a02b-4341-bb59-d4496241d654'),
	('10c97f59-7140-4e8b-ba7c-dde4575bdc77', '10c97f59-7140-4e8b-ba7c-dde4575bdc77', '{"sub": "10c97f59-7140-4e8b-ba7c-dde4575bdc77", "email": "inviter@scottbenton.dev", "email_verified": false, "phone_verified": false}', 'email', '2025-04-21 01:46:13.780853+00', '2025-04-21 01:46:13.780871+00', '2025-04-21 01:46:13.780871+00', '8933a499-9e0e-4ff2-bb29-ff5b0abc53ba'),
	('96d7c931-d72c-4357-adcb-23c2a35c9c2a', '96d7c931-d72c-4357-adcb-23c2a35c9c2a', '{"sub": "96d7c931-d72c-4357-adcb-23c2a35c9c2a", "email": "meeting-editor@scottbenton.dev", "email_verified": false, "phone_verified": false}', 'email', '2025-04-21 01:47:19.435233+00', '2025-04-21 01:47:19.435266+00', '2025-04-21 01:47:19.435266+00', 'bead6154-f3e6-4229-9a8a-a5ad7a6357cb'),
	('8cf2419c-1371-4bba-b186-5790307ac70c', '8cf2419c-1371-4bba-b186-5790307ac70c', '{"sub": "8cf2419c-1371-4bba-b186-5790307ac70c", "email": "viewer@scottbenton.dev", "email_verified": false, "phone_verified": false}', 'email', '2025-04-21 01:47:41.997521+00', '2025-04-21 01:47:41.997541+00', '2025-04-21 01:47:41.997541+00', '3a73f9f0-67f2-4c42-9899-c55a5d22ad5f');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('5e9d4173-44b7-4e44-aa61-cb24ca5c916e', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', '2025-04-21 01:38:54.398313+00', '2025-04-21 01:38:54.398313+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0', '192.168.65.1', NULL),
	('c296745b-d260-4236-8dd0-ea27dff4f839', '8cf2419c-1371-4bba-b186-5790307ac70c', '2025-04-21 01:47:42.000571+00', '2025-04-21 01:47:42.000571+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0', '192.168.65.1', NULL),
	('6aa1f3be-9526-4783-897e-d5d093e45b6a', '8cf2419c-1371-4bba-b186-5790307ac70c', '2025-04-21 01:47:47.194116+00', '2025-04-21 02:41:35.432617+00', NULL, 'aal1', NULL, '2025-04-21 02:41:35.43257', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0', '192.168.65.1', NULL),
	('0a1c710c-dc85-4eee-90e0-9e9fc9172971', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', '2025-04-21 01:39:06.596996+00', '2025-04-21 11:39:24.606542+00', NULL, 'aal1', NULL, '2025-04-21 11:39:24.606506', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('5e9d4173-44b7-4e44-aa61-cb24ca5c916e', '2025-04-21 01:38:54.400795+00', '2025-04-21 01:38:54.400795+00', 'password', '276393f0-925b-4fe2-9bfa-4cdf4ac8564e'),
	('0a1c710c-dc85-4eee-90e0-9e9fc9172971', '2025-04-21 01:39:06.599085+00', '2025-04-21 01:39:06.599085+00', 'otp', 'c26568e8-c530-4ad0-9f3f-7ab70d836bca'),
	('c296745b-d260-4236-8dd0-ea27dff4f839', '2025-04-21 01:47:42.001699+00', '2025-04-21 01:47:42.001699+00', 'password', '0d76b136-302b-4620-80bb-5c152755bb3d'),
	('6aa1f3be-9526-4783-897e-d5d093e45b6a', '2025-04-21 01:47:47.195387+00', '2025-04-21 01:47:47.195387+00', 'otp', '0e75a959-94a8-47e7-a307-5685ac4f43e1');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, '_ylinu8JLlk5WqTdk7_LwA', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', false, '2025-04-21 01:38:54.399322+00', '2025-04-21 01:38:54.399322+00', NULL, '5e9d4173-44b7-4e44-aa61-cb24ca5c916e'),
	('00000000-0000-0000-0000-000000000000', 7, 'PqG7EkYktZveJiiCEkZjcg', '8cf2419c-1371-4bba-b186-5790307ac70c', false, '2025-04-21 01:47:42.001062+00', '2025-04-21 01:47:42.001062+00', NULL, 'c296745b-d260-4236-8dd0-ea27dff4f839'),
	('00000000-0000-0000-0000-000000000000', 2, 'AhzXItshEprU-gqwMBtovw', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 01:39:06.597526+00', '2025-04-21 02:32:48.673849+00', NULL, '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 8, 'GDdspRpH6EMscyjw0zT4gg', '8cf2419c-1371-4bba-b186-5790307ac70c', true, '2025-04-21 01:47:47.194642+00', '2025-04-21 02:41:35.429814+00', NULL, '6aa1f3be-9526-4783-897e-d5d093e45b6a'),
	('00000000-0000-0000-0000-000000000000', 10, 'x1Xi-dk0uIQHoptaOBvMNg', '8cf2419c-1371-4bba-b186-5790307ac70c', false, '2025-04-21 02:41:35.430326+00', '2025-04-21 02:41:35.430326+00', 'GDdspRpH6EMscyjw0zT4gg', '6aa1f3be-9526-4783-897e-d5d093e45b6a'),
	('00000000-0000-0000-0000-000000000000', 9, 'yD5lUJAZILre3lRnvIEXoQ', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 02:32:48.678134+00', '2025-04-21 03:31:12.336511+00', 'AhzXItshEprU-gqwMBtovw', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 11, '289AMLtDF3_myuh1mBCnCg', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 03:31:12.338187+00', '2025-04-21 04:41:10.43072+00', 'yD5lUJAZILre3lRnvIEXoQ', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 12, 'DxvKStuj4iIPXnsrM5V8qA', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 04:41:10.431348+00', '2025-04-21 05:47:17.988768+00', '289AMLtDF3_myuh1mBCnCg', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 13, 'WJYZPlY0tgI0qNsy9ywScw', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 05:47:17.989088+00', '2025-04-21 06:54:20.197033+00', 'DxvKStuj4iIPXnsrM5V8qA', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 14, 'bQtTH0IkHQYpLxdHg-rJPQ', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 06:54:20.197831+00', '2025-04-21 07:55:30.553343+00', 'WJYZPlY0tgI0qNsy9ywScw', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 15, 'iTpI89vVm2_863GYyWPCWg', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 07:55:30.55365+00', '2025-04-21 08:56:52.826127+00', 'bQtTH0IkHQYpLxdHg-rJPQ', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 16, 'CSF3grQ0YUD9uWmdoxdRHw', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 08:56:52.82703+00', '2025-04-21 09:55:53.940041+00', 'iTpI89vVm2_863GYyWPCWg', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 17, '93NWKCnrND1EaRD7GvNz9A', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 09:55:53.940642+00', '2025-04-21 10:47:47.998565+00', 'CSF3grQ0YUD9uWmdoxdRHw', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 18, 'NC5LjCSeJ7Oxd7YYSxE1XA', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', true, '2025-04-21 10:47:47.999227+00', '2025-04-21 11:39:24.604543+00', '93NWKCnrND1EaRD7GvNz9A', '0a1c710c-dc85-4eee-90e0-9e9fc9172971'),
	('00000000-0000-0000-0000-000000000000', 19, 'OS2mlf2VOPSqQ6C8us3yrw', '309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', false, '2025-04-21 11:39:24.604958+00', '2025-04-21 11:39:24.604958+00', 'NC5LjCSeJ7Oxd7YYSxE1XA', '0a1c710c-dc85-4eee-90e0-9e9fc9172971');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: dashboards; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."dashboards" ("id", "label", "created_at") VALUES
	(1, 'Delaware County School Boards', '2025-04-21 01:39:35.035663+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "display_name", "created_at", "email_address") VALUES
	('309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', 'Admin User', '2025-04-21 01:38:54.379824+00', 'admin@scottbenton.dev'),
	('10c97f59-7140-4e8b-ba7c-dde4575bdc77', 'Inviter User', '2025-04-21 01:46:13.777455+00', 'inviter@scottbenton.dev'),
	('96d7c931-d72c-4357-adcb-23c2a35c9c2a', 'Meeting Editor User', '2025-04-21 01:47:19.432543+00', 'meeting-editor@scottbenton.dev'),
	('8cf2419c-1371-4bba-b186-5790307ac70c', 'Viewer User', '2025-04-21 01:47:41.994337+00', 'viewer@scottbenton.dev');


--
-- Data for Name: dashboard_user_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: dashboard_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."dashboard_users" ("user_id", "dashboard_id", "can_manage_users", "is_admin", "created_at", "can_manage_meetings") VALUES
	('309d645d-e4e2-43a5-8d07-ae1a8e8ee79d', 1, true, true, '2025-04-21 01:39:35.055414+00', true),
	('10c97f59-7140-4e8b-ba7c-dde4575bdc77', 1, true, false, '2025-04-21 01:46:26.969103+00', false),
	('8cf2419c-1371-4bba-b186-5790307ac70c', 1, false, false, '2025-04-21 01:47:56.251738+00', false),
	('96d7c931-d72c-4357-adcb-23c2a35c9c2a', 1, false, false, '2025-04-21 01:47:31.641293+00', true);


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."organizations" ("id", "dashboard_id", "name", "url", "sync_error", "last_synced", "created_at", "description", "sync_pending") VALUES
	(12, 1, 'William Penn School District', 'https://go.boarddocs.com/pa/wpen/Board.nsf/Public', NULL, '2025-04-21 12:04:52.176+00', '2025-04-21 01:43:23.92462+00', NULL, false),
	(6, 1, 'Penn-Delco School District', 'https://www.pdsd.org/board/meeting-agendas-and-minutes', 'No scraper found for organization', NULL, '2025-04-21 01:41:24.522664+00', NULL, false),
	(3, 1, 'Garnet Valley School District', 'https://sites.google.com/garnetvalley.org/garnet-valley-school-board/agendas?authuser=0', 'No scraper found for organization', NULL, '2025-04-21 01:40:31.512204+00', NULL, false),
	(5, 1, 'Interboro School District', 'https://go.boarddocs.com/pa/interboro/Board.nsf/Public', NULL, '2025-04-21 12:05:20.135+00', '2025-04-21 01:41:07.205833+00', NULL, false),
	(8, 1, 'Ridley School District', 'https://www.ridleysd.org/page/school-board/', 'No scraper found for organization', NULL, '2025-04-21 01:42:05.377599+00', NULL, false),
	(2, 1, 'Chichester School District', 'https://go.boarddocs.com/pa/chic/Board.nsf/Public', NULL, '2025-04-21 12:05:36.581+00', '2025-04-21 01:40:11.537584+00', NULL, false),
	(10, 1, 'Upper Darby School District', 'https://go.boarddocs.com/pa/udar/Board.nsf/Public', NULL, '2025-04-21 12:05:43.74+00', '2025-04-21 01:42:49.119707+00', NULL, false),
	(7, 1, 'Radnor Township School District', 'https://go.boarddocs.com/pa/radn/Board.nsf/Public', NULL, '2025-04-21 12:06:11.709+00', '2025-04-21 01:41:45.58816+00', NULL, false),
	(11, 1, 'Wallingford-Swarthmore School District', 'https://go.boarddocs.com/pa/wlsw/Board.nsf/Public#', NULL, '2025-04-21 12:06:33.161+00', '2025-04-21 01:43:05.911266+00', NULL, false),
	(4, 1, 'Haverford School District', 'https://go.boarddocs.com/pa/have/Board.nsf/vpublic?open#', NULL, '2025-04-21 12:07:16.492+00', '2025-04-21 01:40:48.568017+00', NULL, false),
	(1, 1, 'Chester-Upland School District', 'https://go.boarddocs.com/pa/ches/Board.nsf/Public', NULL, '2025-04-21 12:07:23.809+00', '2025-04-21 01:39:50.610518+00', NULL, false),
	(9, 1, 'Southeast Delco School District', 'https://go.boarddocs.com/pa/sedelco/Board.nsf/Public', NULL, '2025-04-21 12:07:30.844+00', '2025-04-21 01:42:31.677386+00', NULL, false);


--
-- Data for Name: meetings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."meetings" ("id", "organization_id", "name", "meeting_date", "created_at", "created_by") VALUES
	(19, 12, 'COMMITTEE MEETING OF THE WHOLE', '2025-04-21', '2025-04-21 12:04:52.135395+00', NULL),
	(20, 12, 'BUSINESS MEETING OF THE BOARD OF SCHOOL DIRECTORS', '2025-04-28', '2025-04-21 12:04:52.136141+00', NULL),
	(21, 5, 'Interboro Board of School Directors Work Session - 7:00 PM', '2025-04-22', '2025-04-21 12:05:20.0739+00', NULL),
	(22, 7, 'REGULAR BUSINESS MEETING', '2025-04-22', '2025-04-21 12:06:11.331257+00', NULL),
	(23, 11, 'FACILITIES & FINANCE COMMITTEE MEETING', '2025-04-23', '2025-04-21 12:06:31.931652+00', NULL);


--
-- Data for Name: meeting_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."meeting_documents" ("id", "meeting_id", "filename", "file_hash", "created_at", "created_by") VALUES
	(103, 19, 'COMMITTEE MEETING OF THE WHOLE-04-21-2025.pdf', '9e8dfa054d5e76d1a71c8f5e922a4ed8', '2025-04-21 12:04:52.172162+00', NULL),
	(104, 20, 'BUSINESS MEETING OF THE BOARD OF SCHOOL DIRECTORS-04-28-2025.pdf', '41e5265e3064ccab40361465a2a415fc', '2025-04-21 12:04:52.172583+00', NULL),
	(105, 21, 'Interboro Board of School Directors Work Session - 7_00 PM-04-22-2025.pdf', 'bcb64a2636680fbde0c2edb1c8d3ab6c', '2025-04-21 12:05:20.129262+00', NULL),
	(106, 22, 'REGULAR BUSINESS MEETING-04-22-2025.pdf', '16787bd89bb322e1dcfd027c6c3fa1e7', '2025-04-21 12:06:11.381777+00', NULL),
	(107, 22, 'PDE 2028 Proposed Final Budget 25-26.pdf', '967fcaa3af63e484db308edbae522abe', '2025-04-21 12:06:11.405756+00', NULL),
	(108, 22, '4-8-25 Finance Committee Budget Presentation.pdf', 'f33a55094b996404b5d852e7d33b0426', '2025-04-21 12:06:11.428013+00', NULL),
	(109, 22, 'RESOLUTION - DCIU Board member 2025.pdf', '86c7e16eb260e3d780d192a078aa02b8', '2025-04-21 12:06:11.488509+00', NULL),
	(110, 22, 'MINUTES - 03-25-2025 Regular Business Meeting.pdf', 'e48eb875454a95d42c05517bf6718707', '2025-04-21 12:06:11.505322+00', NULL),
	(111, 22, 'Public Financial Report February 2025.pdf', '8735890478a7afe9780a7075ff1115a4', '2025-04-21 12:06:11.530076+00', NULL),
	(112, 22, 'Radnor Township School-DW-PDC FS 06-30-24 - Final.pdf', 'd04490296e4a29249b9caa94954ef768', '2025-04-21 12:06:11.556932+00', NULL),
	(113, 22, 'POL 606 - REDLINE.pdf', '6fb3200061af507709a07fa0fce93301', '2025-04-21 12:06:11.611738+00', NULL),
	(114, 22, 'POL 607 - REDLINE.pdf', '31e79c96cbf03d988d2110cfa58b5b57', '2025-04-21 12:06:11.626652+00', NULL),
	(115, 22, 'POL 608 - REDLINE.pdf', '17e4abc81d0a346df908664ef0d950a0', '2025-04-21 12:06:11.640662+00', NULL),
	(116, 22, 'POL 615 - REDLINE.pdf', '3e7de7eb639a77e51f2bfb91c1ae25fe', '2025-04-21 12:06:11.653804+00', NULL),
	(117, 22, 'Pol 617 - CURRENT.pdf', '7386b00457465ae6e90b409dc511383a', '2025-04-21 12:06:11.666697+00', NULL),
	(118, 22, 'POL 202 - REDLINE.pdf', 'c0b717c11a88bb7056682fd444706b00', '2025-04-21 12:06:11.681309+00', NULL),
	(119, 22, 'Pol 614 - REDLINE.pdf', '2a029a91df05eb14e1d6097af4e01cc9', '2025-04-21 12:06:11.69313+00', NULL),
	(120, 22, 'Pol 807 - REDLINE.pdf', '4683736c15ce83d137325a1b74f8234c', '2025-04-21 12:06:11.707001+00', NULL),
	(121, 23, 'FINANCE-04-23-2025-FUND 10 BILL''S LIST MARCH 2025.pdf', '313eee14d6d9c9dc280a2856b1c0abd9', '2025-04-21 12:06:31.968783+00', NULL),
	(122, 23, 'FINANCE-04-23-2025-FUND 10 FINANCIALS MARCH 2025.pdf', '6dd30f449d91f3f988726fbba0e30e95', '2025-04-21 12:06:31.986146+00', NULL),
	(123, 23, 'FINANCE-04-23-2025-FUND 32 BILL''S LIST MARCH 2025.pdf', 'bd2f650bea90a82fcc00741d70231b39', '2025-04-21 12:06:32.001127+00', NULL),
	(124, 23, 'FINANCE-04-23-2025-FUND 32 FINANCIALS MARCH 2025.pdf', 'eac3ef6de3e5926851573084224ab376', '2025-04-21 12:06:32.01351+00', NULL),
	(125, 23, 'FINANCE-04-23-2025-FUND 39 FINANCIALS MARCH 2025.pdf', '83e6a5af76e4329397ea6fda5e4ff000', '2025-04-21 12:06:32.025581+00', NULL),
	(126, 23, 'FINANCE-04-23-2025-FUND 51 BILL''S LIST MARCH 2025.pdf', '99a059c693289e21dd043f91df15d9e9', '2025-04-21 12:06:32.037789+00', NULL),
	(127, 23, 'FINANCE-04-23-2025-FUND 51 FINANCIALS MARCH 2025.pdf', '048b405b93a30467baf36ecd69a75938', '2025-04-21 12:06:32.051597+00', NULL),
	(128, 23, 'FINANCE-04-23-2025-FUND 71 FINANCIALS MARCH 2025.pdf', '079d6296849fe85270132b2f774006dd', '2025-04-21 12:06:32.066267+00', NULL),
	(129, 23, 'FINANCE-04-23-2025-FUND 81 BILL''S LIST MARCH 2025.pdf', '8567d2b9da5f281a0100572967c6a9a9', '2025-04-21 12:06:32.080837+00', NULL),
	(130, 23, 'FINANCE-04-23-2025-FUND 81 FINANCIALS MARCH 2025.pdf', '1abd5c8afd15aac314237fc193df12cf', '2025-04-21 12:06:32.105815+00', NULL),
	(131, 23, 'FINANCE-04-23-2025-TREASURER''S REPORT MARCH 2025.pdf', 'd61d215335708c580c2e7612563ddaf0', '2025-04-21 12:06:32.121282+00', NULL),
	(132, 23, 'STUDENT SERVICES-04-23-25-CRITICARE AGREEMENT.pdf', 'ed65e8b7a20107e2badd5a635df9d9a3', '2025-04-21 12:06:32.140779+00', NULL),
	(133, 23, 'WES-04-23-25-PTO DONATION.pdf', '6112dc3e48c3ae87085bb7a09cf5f342', '2025-04-21 12:06:32.284231+00', NULL),
	(134, 23, 'TECHNOLOGY-04-23-25-SYSCLOUD (AMENDMENT).pdf', 'd4c7283be83094998980bdd32ed3a4b4', '2025-04-21 12:06:32.37195+00', NULL),
	(135, 23, 'STUDENT SERVICES-04-23-25-FTLOBG (MS).pdf', 'c93982a2de157a359cd7bbc8864d6ace', '2025-04-21 12:06:32.398252+00', NULL),
	(136, 23, 'STUDENT SERVICES-04-23-25-FTLOBG (HS).pdf', 'ee72dac7ddc8d93244077f6853d6bb78', '2025-04-21 12:06:32.47349+00', NULL),
	(137, 23, 'STUDENT SERVICES-04-23-25-EFFECTIVE SCHOOL SOLUTIONS.pdf', '9b8d80fa6082918da8875e1ac2b6d041', '2025-04-21 12:06:32.800698+00', NULL),
	(138, 23, 'OPERATIONS-04-23-25-HONEYWELL.pdf', '3a6ac21c64b618e897a8fb364dd70fff', '2025-04-21 12:06:32.828003+00', NULL),
	(139, 23, 'HUMAN RESOURCES-04-23-25-VIDCRUITER.pdf', '110ec2922af3e97535b9fe1c0b33e8da', '2025-04-21 12:06:32.854026+00', NULL),
	(140, 23, 'HUMAN RESOURCES-04-23-25-LANCASTER LEBANON IU.pdf', '80b34737b5831bc962bef65e74ce33fb', '2025-04-21 12:06:32.876768+00', NULL),
	(141, 23, 'FINANCE-04-23-25-REVENUE ACTUALS THROUGH MARCH 2025.pdf', '4ddbe37a2f6388bfcf848761f18402fd', '2025-04-21 12:06:32.894797+00', NULL),
	(142, 23, 'FINANCE-04-23-25-POLICY 610 PROCUREMENT AR (DRAFT).pdf', 'a0f26c554a1158c3f6c88b3e4419aeea', '2025-04-21 12:06:32.908752+00', NULL),
	(143, 23, 'FINANCE-04-23-25-POLICY 610 PROCUREMENT (DRAFT).pdf', '7b8da34edc0ec8e68bb777e4ac9094c0', '2025-04-21 12:06:32.920404+00', NULL),
	(144, 23, 'FINANCE-04-23-25-FINANCE COMMITTEE PRESENTATION.pdf', '42593fe14f5bcc5a00178384b4b15c9d', '2025-04-21 12:06:32.949181+00', NULL),
	(145, 23, 'CURRICULUM-04-23-25-NWEA.pdf', '92ac586c0833b9f3f216e4339e8fc4bf', '2025-04-21 12:06:33.007802+00', NULL),
	(146, 23, 'CURRICULUM-04-23-25-NEWSELA.pdf', 'eac25efd940d9ea70382fd43c9003cff', '2025-04-21 12:06:33.031387+00', NULL),
	(147, 23, 'BUSINESS OFFICE-04-23-25-TOM JOSIAH CONSULTING LLC.pdf', 'd0b821f650e5ce8a3e76c05069934873', '2025-04-21 12:06:33.046949+00', NULL),
	(148, 23, 'CURRICULUM-04-23-25-KLETT WORLD LANGUAGES INC-CURRICULUM.pdf', 'c062130b6065a69cfa8a5f0428e2a5f8', '2025-04-21 12:06:33.062756+00', NULL),
	(149, 23, 'ATHLETICS-04-23-25-DANIEL WALSH.pdf', '765461770603c15ac7afecfd2f95468b', '2025-04-21 12:06:33.079472+00', NULL),
	(150, 23, 'ASSISTANT SUPERINTENDENT-04-23-25-LINKIT!.pdf', '31487278da2e3d1302fe32064405c824', '2025-04-21 12:06:33.106234+00', NULL),
	(151, 23, 'FINANCE-04-23-25-EXPENDITURE ACTUALS THROUGH MARCH 2025.pdf', 'cebf9a572993985a7808b0644694ddc5', '2025-04-21 12:06:33.139069+00', NULL),
	(152, 23, 'SAFETY SECURITY-04-23-25-NAVIGATE 360 QUOTE W-169511.pdf', '4ccd3cbcf031e70d6b1791a02ad8eae4', '2025-04-21 12:06:33.159489+00', NULL);


--
-- Data for Name: meeting_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('meeting-documents', 'meeting-documents', NULL, '2025-04-21 01:44:23.389954+00', '2025-04-21 01:44:23.389954+00', false, false, 262144000, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") VALUES
	('cbda50e9-6f03-43b1-bb5e-c9cac65e2d9b', 'meeting-documents', '1/5/21/Interboro Board of School Directors Work Session - 7_00 PM-04-22-2025.pdf', NULL, '2025-04-21 12:05:20.119519+00', '2025-04-21 12:05:20.119519+00', '2025-04-21 12:05:20.119519+00', '{"eTag": "\"bcb64a2636680fbde0c2edb1c8d3ab6c\"", "size": 2181, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:05:20.116Z", "contentLength": 2181, "httpStatusCode": 200}', '6a03b3c6-b4d3-4767-8f7b-5164bc42e025', NULL, '{}', 4),
	('097f9152-5d54-43a6-91c8-4f247ce0039e', 'meeting-documents', '1/7/22/REGULAR BUSINESS MEETING-04-22-2025.pdf', NULL, '2025-04-21 12:06:11.364005+00', '2025-04-21 12:06:11.364005+00', '2025-04-21 12:06:11.364005+00', '{"eTag": "\"16787bd89bb322e1dcfd027c6c3fa1e7\"", "size": 73892, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.360Z", "contentLength": 73892, "httpStatusCode": 200}', '42b1bd5d-b119-4a29-af83-c94aa603d63c', NULL, '{}', 4),
	('74593de1-2feb-42a5-b717-7edd3cb5b60e', 'meeting-documents', '1/7/22/PDE 2028 Proposed Final Budget 25-26.pdf', NULL, '2025-04-21 12:06:11.398565+00', '2025-04-21 12:06:11.398565+00', '2025-04-21 12:06:11.398565+00', '{"eTag": "\"967fcaa3af63e484db308edbae522abe\"", "size": 469588, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.394Z", "contentLength": 469588, "httpStatusCode": 200}', '2aa29e29-7b5e-4648-94ec-1fa415a16a90', NULL, '{}', 4),
	('758e92fb-ec31-467c-a734-c0ec8398fe32', 'meeting-documents', '1/7/22/4-8-25 Finance Committee Budget Presentation.pdf', NULL, '2025-04-21 12:06:11.420862+00', '2025-04-21 12:06:11.420862+00', '2025-04-21 12:06:11.420862+00', '{"eTag": "\"f33a55094b996404b5d852e7d33b0426\"", "size": 219562, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.417Z", "contentLength": 219562, "httpStatusCode": 200}', '9f8297d4-2331-446e-9199-c455b53399fc', NULL, '{}', 4),
	('1e39bb2a-0b7a-417f-8621-468f1bb0a0d1', 'meeting-documents', '1/7/22/RESOLUTION - DCIU Board member 2025.pdf', NULL, '2025-04-21 12:06:11.482144+00', '2025-04-21 12:06:11.482144+00', '2025-04-21 12:06:11.482144+00', '{"eTag": "\"86c7e16eb260e3d780d192a078aa02b8\"", "size": 655565, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.440Z", "contentLength": 655565, "httpStatusCode": 200}', '86532ce8-71e6-4707-ac4d-837c9bda1abf', NULL, '{}', 4),
	('013e0b36-e221-434e-8b1c-2414c991815a', 'meeting-documents', '1/7/22/MINUTES - 03-25-2025 Regular Business Meeting.pdf', NULL, '2025-04-21 12:06:11.500548+00', '2025-04-21 12:06:11.500548+00', '2025-04-21 12:06:11.500548+00', '{"eTag": "\"e48eb875454a95d42c05517bf6718707\"", "size": 240714, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.497Z", "contentLength": 240714, "httpStatusCode": 200}', '4825d6f3-3eab-493d-be21-da387b82b556', NULL, '{}', 4),
	('e8b10a49-47cb-4f0e-bd5c-46bdf3d7dfd1', 'meeting-documents', '1/7/22/Public Financial Report February 2025.pdf', NULL, '2025-04-21 12:06:11.524363+00', '2025-04-21 12:06:11.524363+00', '2025-04-21 12:06:11.524363+00', '{"eTag": "\"8735890478a7afe9780a7075ff1115a4\"", "size": 1180074, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.518Z", "contentLength": 1180074, "httpStatusCode": 200}', 'e9372861-7004-4c72-9b7d-910842c14c69', NULL, '{}', 4),
	('b3354da0-2f77-47ef-8640-2931ee1abc7c', 'meeting-documents', '1/7/22/Radnor Township School-DW-PDC FS 06-30-24 - Final.pdf', NULL, '2025-04-21 12:06:11.551273+00', '2025-04-21 12:06:11.551273+00', '2025-04-21 12:06:11.551273+00', '{"eTag": "\"d04490296e4a29249b9caa94954ef768\"", "size": 1001416, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.543Z", "contentLength": 1001416, "httpStatusCode": 200}', 'df190497-2284-4b1b-a56d-1eb6037d3dbc', NULL, '{}', 4),
	('ca5d24d8-39a0-4f11-8d57-a2d1d9c0bf92', 'meeting-documents', '1/7/22/POL 606 - REDLINE.pdf', NULL, '2025-04-21 12:06:11.605553+00', '2025-04-21 12:06:11.605553+00', '2025-04-21 12:06:11.605553+00', '{"eTag": "\"6fb3200061af507709a07fa0fce93301\"", "size": 99524, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.565Z", "contentLength": 99524, "httpStatusCode": 200}', '6cb6e4e5-1dac-40a6-953e-9b53e5ffa30a', NULL, '{}', 4),
	('2ae7a70e-4ace-4796-94c6-b12b5e8963b7', 'meeting-documents', '1/7/22/POL 607 - REDLINE.pdf', NULL, '2025-04-21 12:06:11.621272+00', '2025-04-21 12:06:11.621272+00', '2025-04-21 12:06:11.621272+00', '{"eTag": "\"31e79c96cbf03d988d2110cfa58b5b57\"", "size": 95815, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.619Z", "contentLength": 95815, "httpStatusCode": 200}', '47c0b663-9cf0-4651-bb63-8541b07f541e', NULL, '{}', 4),
	('c2e12f65-76a6-4397-92ea-c300b2b39102', 'meeting-documents', '1/7/22/POL 608 - REDLINE.pdf', NULL, '2025-04-21 12:06:11.635926+00', '2025-04-21 12:06:11.635926+00', '2025-04-21 12:06:11.635926+00', '{"eTag": "\"17e4abc81d0a346df908664ef0d950a0\"", "size": 96255, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.633Z", "contentLength": 96255, "httpStatusCode": 200}', 'ad1bdf1b-801c-41e7-85dd-407ac64e6d5f', NULL, '{}', 4),
	('8bf2ae33-ef75-496c-8251-1d26ee4a4cfa', 'meeting-documents', '1/12/20/BUSINESS MEETING OF THE BOARD OF SCHOOL DIRECTORS-04-28-2025.pdf', NULL, '2025-04-21 12:04:52.164416+00', '2025-04-21 12:04:52.164416+00', '2025-04-21 12:04:52.164416+00', '{"eTag": "\"41e5265e3064ccab40361465a2a415fc\"", "size": 26591, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:04:52.161Z", "contentLength": 26591, "httpStatusCode": 200}', 'f12ccdc4-7c54-4f34-a76c-5419e67699b1', NULL, '{}', 4),
	('38a13d9f-b96c-445a-b763-14881721921d', 'meeting-documents', '1/7/22/POL 615 - REDLINE.pdf', NULL, '2025-04-21 12:06:11.649381+00', '2025-04-21 12:06:11.649381+00', '2025-04-21 12:06:11.649381+00', '{"eTag": "\"3e7de7eb639a77e51f2bfb91c1ae25fe\"", "size": 89063, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.647Z", "contentLength": 89063, "httpStatusCode": 200}', '9321d8e8-cf8e-454d-a958-90f17010197e', NULL, '{}', 4),
	('4628d7ae-8519-462e-9166-12a6547f62e9', 'meeting-documents', '1/7/22/Pol 617 - CURRENT.pdf', NULL, '2025-04-21 12:06:11.661191+00', '2025-04-21 12:06:11.661191+00', '2025-04-21 12:06:11.661191+00', '{"eTag": "\"7386b00457465ae6e90b409dc511383a\"", "size": 66410, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.659Z", "contentLength": 66410, "httpStatusCode": 200}', 'acc27cdd-9e90-447b-bc6e-44e0294f2a97', NULL, '{}', 4),
	('21924e82-686e-4efd-8472-a3fe8cec4cef', 'meeting-documents', '1/7/22/POL 202 - REDLINE.pdf', NULL, '2025-04-21 12:06:11.675889+00', '2025-04-21 12:06:11.675889+00', '2025-04-21 12:06:11.675889+00', '{"eTag": "\"c0b717c11a88bb7056682fd444706b00\"", "size": 125271, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.673Z", "contentLength": 125271, "httpStatusCode": 200}', 'c296baa6-23dc-4101-97aa-9024bb1d88f9', NULL, '{}', 4),
	('d6a2208f-67be-43a0-b20f-33e4bd7714fa', 'meeting-documents', '1/7/22/Pol 614 - REDLINE.pdf', NULL, '2025-04-21 12:06:11.689335+00', '2025-04-21 12:06:11.689335+00', '2025-04-21 12:06:11.689335+00', '{"eTag": "\"2a029a91df05eb14e1d6097af4e01cc9\"", "size": 92111, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.687Z", "contentLength": 92111, "httpStatusCode": 200}', '2d8f2d2f-d17c-4c88-a8e6-5e603ea0b732', NULL, '{}', 4),
	('fa4461d4-d655-4aa9-81e4-49e487614665', 'meeting-documents', '1/7/22/Pol 807 - REDLINE.pdf', NULL, '2025-04-21 12:06:11.702206+00', '2025-04-21 12:06:11.702206+00', '2025-04-21 12:06:11.702206+00', '{"eTag": "\"4683736c15ce83d137325a1b74f8234c\"", "size": 109309, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:11.700Z", "contentLength": 109309, "httpStatusCode": 200}', '43317f73-fee7-41e7-83bb-49a56695e83f', NULL, '{}', 4),
	('385ad6fb-2829-4c24-b0de-6c1c3df5419b', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 10 BILL''S LIST MARCH 2025.pdf', NULL, '2025-04-21 12:06:31.961712+00', '2025-04-21 12:06:31.961712+00', '2025-04-21 12:06:31.961712+00', '{"eTag": "\"313eee14d6d9c9dc280a2856b1c0abd9\"", "size": 95682, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:31.958Z", "contentLength": 95682, "httpStatusCode": 200}', '9cfdecd1-afe7-4044-8fc5-8eac9f2bf799', NULL, '{}', 4),
	('6031b3b2-0547-45d6-9897-d8dd5e61c412', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 10 FINANCIALS MARCH 2025.pdf', NULL, '2025-04-21 12:06:31.979464+00', '2025-04-21 12:06:31.979464+00', '2025-04-21 12:06:31.979464+00', '{"eTag": "\"6dd30f449d91f3f988726fbba0e30e95\"", "size": 34976, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:31.977Z", "contentLength": 34976, "httpStatusCode": 200}', 'b78521eb-f78a-4f6c-87cf-3be895966670', NULL, '{}', 4),
	('52f57df8-0081-459f-8219-caf8ce7033e4', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 32 BILL''S LIST MARCH 2025.pdf', NULL, '2025-04-21 12:06:31.995391+00', '2025-04-21 12:06:31.995391+00', '2025-04-21 12:06:31.995391+00', '{"eTag": "\"bd2f650bea90a82fcc00741d70231b39\"", "size": 12441, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:31.993Z", "contentLength": 12441, "httpStatusCode": 200}', '9ae0fecc-fbb6-4a21-a4a6-d13214230146', NULL, '{}', 4),
	('8f7f018f-6674-4f8e-a903-913e1e0c6c5e', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 32 FINANCIALS MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.008666+00', '2025-04-21 12:06:32.008666+00', '2025-04-21 12:06:32.008666+00', '{"eTag": "\"eac3ef6de3e5926851573084224ab376\"", "size": 19292, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.007Z", "contentLength": 19292, "httpStatusCode": 200}', 'e7b07c96-06da-4937-9120-b10d96496e17', NULL, '{}', 4),
	('6c339879-0a98-4b28-a4d0-5545e8282fad', 'meeting-documents', '1/12/19/COMMITTEE MEETING OF THE WHOLE-04-21-2025.pdf', NULL, '2025-04-21 12:04:52.163954+00', '2025-04-21 12:04:52.163954+00', '2025-04-21 12:04:52.163954+00', '{"eTag": "\"9e8dfa054d5e76d1a71c8f5e922a4ed8\"", "size": 3215, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:04:52.161Z", "contentLength": 3215, "httpStatusCode": 200}', '9bf2c141-1bf1-4cea-8ac2-047a669272c4', NULL, '{}', 4),
	('89ed870c-f8e3-44dd-a4b5-56fa85b78b2d', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 39 FINANCIALS MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.021377+00', '2025-04-21 12:06:32.021377+00', '2025-04-21 12:06:32.021377+00', '{"eTag": "\"83e6a5af76e4329397ea6fda5e4ff000\"", "size": 17008, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.020Z", "contentLength": 17008, "httpStatusCode": 200}', '7812bf4d-fbc1-4f7f-9161-5bec2603fbdf', NULL, '{}', 4),
	('29ab9025-155c-4220-b32a-fd56a984ef23', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 51 BILL''S LIST MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.033131+00', '2025-04-21 12:06:32.033131+00', '2025-04-21 12:06:32.033131+00', '{"eTag": "\"99a059c693289e21dd043f91df15d9e9\"", "size": 12584, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.031Z", "contentLength": 12584, "httpStatusCode": 200}', '57d00c14-9787-4e01-bc5c-39e5d96b52a2', NULL, '{}', 4),
	('9512ee53-f043-4c84-af92-f17b1a7c32cb', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 51 FINANCIALS MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.045924+00', '2025-04-21 12:06:32.045924+00', '2025-04-21 12:06:32.045924+00', '{"eTag": "\"048b405b93a30467baf36ecd69a75938\"", "size": 20996, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.044Z", "contentLength": 20996, "httpStatusCode": 200}', 'f9614abd-8ff2-4646-bdd6-afa99ea58cbc', NULL, '{}', 4),
	('4f04f127-38ec-43e3-ac60-eaf34f756d6a', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 71 FINANCIALS MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.060325+00', '2025-04-21 12:06:32.060325+00', '2025-04-21 12:06:32.060325+00', '{"eTag": "\"079d6296849fe85270132b2f774006dd\"", "size": 19247, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.058Z", "contentLength": 19247, "httpStatusCode": 200}', '03df9d85-4585-4502-9c9f-1224f1aa0afd', NULL, '{}', 4),
	('860a0381-b38b-43fc-89cf-2ac3603191fb', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 81 BILL''S LIST MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.075695+00', '2025-04-21 12:06:32.075695+00', '2025-04-21 12:06:32.075695+00', '{"eTag": "\"8567d2b9da5f281a0100572967c6a9a9\"", "size": 15421, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.074Z", "contentLength": 15421, "httpStatusCode": 200}', 'faba49a6-108b-4855-9338-cf81bb9b0c95', NULL, '{}', 4),
	('4b40bddb-4eee-4264-9c26-cef1cc0b834e', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-FUND 81 FINANCIALS MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.101034+00', '2025-04-21 12:06:32.101034+00', '2025-04-21 12:06:32.101034+00', '{"eTag": "\"1abd5c8afd15aac314237fc193df12cf\"", "size": 22678, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.098Z", "contentLength": 22678, "httpStatusCode": 200}', '0c177929-846f-449e-990d-9d07710bdb0c', NULL, '{}', 4),
	('6a8af49e-d6fb-4943-a101-604e9a4718b0', 'meeting-documents', '1/11/23/FINANCE-04-23-2025-TREASURER''S REPORT MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.116648+00', '2025-04-21 12:06:32.116648+00', '2025-04-21 12:06:32.116648+00', '{"eTag": "\"d61d215335708c580c2e7612563ddaf0\"", "size": 213996, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.113Z", "contentLength": 213996, "httpStatusCode": 200}', '2f4f1fa3-5b94-4e2b-89a6-b880f0aafa26', NULL, '{}', 4),
	('91833614-b71b-4518-b9cc-30e9bba96ff8', 'meeting-documents', '1/11/23/STUDENT SERVICES-04-23-25-CRITICARE AGREEMENT.pdf', NULL, '2025-04-21 12:06:32.134428+00', '2025-04-21 12:06:32.134428+00', '2025-04-21 12:06:32.134428+00', '{"eTag": "\"ed65e8b7a20107e2badd5a635df9d9a3\"", "size": 530763, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.130Z", "contentLength": 530763, "httpStatusCode": 200}', 'd72003c7-2c22-498a-8033-7038fd6f609d', NULL, '{}', 4),
	('a7cb93a0-86c2-48c4-b621-1530268be3d0', 'meeting-documents', '1/11/23/WES-04-23-25-PTO DONATION.pdf', NULL, '2025-04-21 12:06:32.219414+00', '2025-04-21 12:06:32.219414+00', '2025-04-21 12:06:32.219414+00', '{"eTag": "\"6112dc3e48c3ae87085bb7a09cf5f342\"", "size": 212759, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.210Z", "contentLength": 212759, "httpStatusCode": 200}', 'cdd992f8-4f64-4f3f-ab59-c68fd5bc2b0a', NULL, '{}', 4),
	('ce3c2b33-bb9e-49cb-aef5-6938009d96e8', 'meeting-documents', '1/11/23/TECHNOLOGY-04-23-25-SYSCLOUD (AMENDMENT).pdf', NULL, '2025-04-21 12:06:32.36396+00', '2025-04-21 12:06:32.36396+00', '2025-04-21 12:06:32.36396+00', '{"eTag": "\"d4c7283be83094998980bdd32ed3a4b4\"", "size": 122281, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.355Z", "contentLength": 122281, "httpStatusCode": 200}', 'b374d942-145b-4c17-a500-dc66040df93a', NULL, '{}', 4),
	('73a1b7ff-75d7-4752-88e2-937a12719cb4', 'meeting-documents', '1/11/23/STUDENT SERVICES-04-23-25-FTLOBG (MS).pdf', NULL, '2025-04-21 12:06:32.391407+00', '2025-04-21 12:06:32.391407+00', '2025-04-21 12:06:32.391407+00', '{"eTag": "\"c93982a2de157a359cd7bbc8864d6ace\"", "size": 249193, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.386Z", "contentLength": 249193, "httpStatusCode": 200}', '5704ef1a-07e0-43c9-a264-f5831f637ebe', NULL, '{}', 4),
	('c2a3df54-5872-4d6c-b5a6-82cf53cefa8e', 'meeting-documents', '1/11/23/STUDENT SERVICES-04-23-25-FTLOBG (HS).pdf', NULL, '2025-04-21 12:06:32.442788+00', '2025-04-21 12:06:32.442788+00', '2025-04-21 12:06:32.442788+00', '{"eTag": "\"ee72dac7ddc8d93244077f6853d6bb78\"", "size": 249320, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.430Z", "contentLength": 249320, "httpStatusCode": 200}', '079fd319-6af1-42de-bc9c-fb730dc2cc55', NULL, '{}', 4),
	('26f5fee2-1893-4843-b083-32bd0940574c', 'meeting-documents', '1/11/23/STUDENT SERVICES-04-23-25-EFFECTIVE SCHOOL SOLUTIONS.pdf', NULL, '2025-04-21 12:06:32.770163+00', '2025-04-21 12:06:32.770163+00', '2025-04-21 12:06:32.770163+00', '{"eTag": "\"9b8d80fa6082918da8875e1ac2b6d041\"", "size": 515343, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.757Z", "contentLength": 515343, "httpStatusCode": 200}', '405f041e-7d3a-403d-93e1-629b0677ee47', NULL, '{}', 4),
	('8816b245-6e15-40b3-aaee-d3cdb8b80269', 'meeting-documents', '1/11/23/OPERATIONS-04-23-25-HONEYWELL.pdf', NULL, '2025-04-21 12:06:32.820796+00', '2025-04-21 12:06:32.820796+00', '2025-04-21 12:06:32.820796+00', '{"eTag": "\"3a6ac21c64b618e897a8fb364dd70fff\"", "size": 121920, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.818Z", "contentLength": 121920, "httpStatusCode": 200}', 'd729f69f-a32b-4219-b850-5356795bb205', NULL, '{}', 4),
	('c4da8b0b-e4a0-4356-82ed-50cdb643b223', 'meeting-documents', '1/11/23/HUMAN RESOURCES-04-23-25-VIDCRUITER.pdf', NULL, '2025-04-21 12:06:32.847958+00', '2025-04-21 12:06:32.847958+00', '2025-04-21 12:06:32.847958+00', '{"eTag": "\"110ec2922af3e97535b9fe1c0b33e8da\"", "size": 439246, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.842Z", "contentLength": 439246, "httpStatusCode": 200}', '7d6baa0d-23ce-4dda-9c75-1d34fd1f3300', NULL, '{}', 4),
	('df7b10cb-353b-4a45-968d-e44b7a4c5bed', 'meeting-documents', '1/11/23/HUMAN RESOURCES-04-23-25-LANCASTER LEBANON IU.pdf', NULL, '2025-04-21 12:06:32.868666+00', '2025-04-21 12:06:32.868666+00', '2025-04-21 12:06:32.868666+00', '{"eTag": "\"80b34737b5831bc962bef65e74ce33fb\"", "size": 222394, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.864Z", "contentLength": 222394, "httpStatusCode": 200}', '02fe6f32-09e1-46cd-b936-a2c6d2edb376', NULL, '{}', 4),
	('80a5baca-34f2-4443-a226-0b8744a5a9e0', 'meeting-documents', '1/11/23/FINANCE-04-23-25-REVENUE ACTUALS THROUGH MARCH 2025.pdf', NULL, '2025-04-21 12:06:32.889978+00', '2025-04-21 12:06:32.889978+00', '2025-04-21 12:06:32.889978+00', '{"eTag": "\"4ddbe37a2f6388bfcf848761f18402fd\"", "size": 251795, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.887Z", "contentLength": 251795, "httpStatusCode": 200}', 'de403ccf-5e66-4996-b358-fc300f3c027e', NULL, '{}', 4),
	('79cf875c-d9b7-4008-aa2d-185a2b4b8b07', 'meeting-documents', '1/11/23/FINANCE-04-23-25-POLICY 610 PROCUREMENT AR (DRAFT).pdf', NULL, '2025-04-21 12:06:32.904448+00', '2025-04-21 12:06:32.904448+00', '2025-04-21 12:06:32.904448+00', '{"eTag": "\"a0f26c554a1158c3f6c88b3e4419aeea\"", "size": 65259, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.902Z", "contentLength": 65259, "httpStatusCode": 200}', 'a09121b6-02ee-4031-a4f9-0a79abf27b77', NULL, '{}', 4),
	('5e9aa304-46f8-470c-a555-88faf271664c', 'meeting-documents', '1/11/23/FINANCE-04-23-25-POLICY 610 PROCUREMENT (DRAFT).pdf', NULL, '2025-04-21 12:06:32.916614+00', '2025-04-21 12:06:32.916614+00', '2025-04-21 12:06:32.916614+00', '{"eTag": "\"7b8da34edc0ec8e68bb777e4ac9094c0\"", "size": 64408, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.914Z", "contentLength": 64408, "httpStatusCode": 200}', '5642ed13-7b12-442a-8238-0a8160ca1268', NULL, '{}', 4),
	('aa7408b1-b663-4f83-941e-8fce84870d05', 'meeting-documents', '1/11/23/FINANCE-04-23-25-FINANCE COMMITTEE PRESENTATION.pdf', NULL, '2025-04-21 12:06:32.94354+00', '2025-04-21 12:06:32.94354+00', '2025-04-21 12:06:32.94354+00', '{"eTag": "\"42593fe14f5bcc5a00178384b4b15c9d\"", "size": 1259276, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.937Z", "contentLength": 1259276, "httpStatusCode": 200}', 'ba91867c-0bfb-461c-a07c-f76d209fa8f0', NULL, '{}', 4),
	('9ed59fe8-91bf-455b-856c-f89965955089', 'meeting-documents', '1/11/23/CURRICULUM-04-23-25-NWEA.pdf', NULL, '2025-04-21 12:06:32.997338+00', '2025-04-21 12:06:32.997338+00', '2025-04-21 12:06:32.997338+00', '{"eTag": "\"92ac586c0833b9f3f216e4339e8fc4bf\"", "size": 2722105, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:32.975Z", "contentLength": 2722105, "httpStatusCode": 200}', 'c07d5506-e543-40de-99d9-5c774d6ced60', NULL, '{}', 4),
	('848a438a-2ee4-4f00-ac6f-3cddc65cbf14', 'meeting-documents', '1/11/23/CURRICULUM-04-23-25-NEWSELA.pdf', NULL, '2025-04-21 12:06:33.025773+00', '2025-04-21 12:06:33.025773+00', '2025-04-21 12:06:33.025773+00', '{"eTag": "\"eac25efd940d9ea70382fd43c9003cff\"", "size": 550918, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:33.021Z", "contentLength": 550918, "httpStatusCode": 200}', 'b02776ef-248a-457f-aa29-be25d5220875', NULL, '{}', 4),
	('648fa584-2415-477f-8044-d613152f1a2c', 'meeting-documents', '1/11/23/BUSINESS OFFICE-04-23-25-TOM JOSIAH CONSULTING LLC.pdf', NULL, '2025-04-21 12:06:33.042605+00', '2025-04-21 12:06:33.042605+00', '2025-04-21 12:06:33.042605+00', '{"eTag": "\"d0b821f650e5ce8a3e76c05069934873\"", "size": 316096, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:33.039Z", "contentLength": 316096, "httpStatusCode": 200}', 'f4f60c3c-120b-4e62-82f2-a90d81f2a2bf', NULL, '{}', 4),
	('210e3bc0-572d-4e90-8c91-2458cf5e03af', 'meeting-documents', '1/11/23/CURRICULUM-04-23-25-KLETT WORLD LANGUAGES INC-CURRICULUM.pdf', NULL, '2025-04-21 12:06:33.055287+00', '2025-04-21 12:06:33.055287+00', '2025-04-21 12:06:33.055287+00', '{"eTag": "\"c062130b6065a69cfa8a5f0428e2a5f8\"", "size": 75439, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:33.053Z", "contentLength": 75439, "httpStatusCode": 200}', '0684306f-4363-4b46-bb38-956b3813b65a', NULL, '{}', 4),
	('77185cec-380b-461b-8974-7453acf193cf', 'meeting-documents', '1/11/23/ATHLETICS-04-23-25-DANIEL WALSH.pdf', NULL, '2025-04-21 12:06:33.07404+00', '2025-04-21 12:06:33.07404+00', '2025-04-21 12:06:33.07404+00', '{"eTag": "\"765461770603c15ac7afecfd2f95468b\"", "size": 151561, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:33.072Z", "contentLength": 151561, "httpStatusCode": 200}', '2442483b-a6ba-4c49-ad64-d8ea6355b897', NULL, '{}', 4),
	('bcc93024-04b1-4156-ad62-4f3913ff3389', 'meeting-documents', '1/11/23/ASSISTANT SUPERINTENDENT-04-23-25-LINKIT!.pdf', NULL, '2025-04-21 12:06:33.092227+00', '2025-04-21 12:06:33.092227+00', '2025-04-21 12:06:33.092227+00', '{"eTag": "\"31487278da2e3d1302fe32064405c824\"", "size": 133779, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:33.090Z", "contentLength": 133779, "httpStatusCode": 200}', '56cbd440-ffc4-47ad-a274-a4f9a0f58682', NULL, '{}', 4),
	('b4cc7ed6-7712-4f07-91df-f400f1534328', 'meeting-documents', '1/11/23/FINANCE-04-23-25-EXPENDITURE ACTUALS THROUGH MARCH 2025.pdf', NULL, '2025-04-21 12:06:33.129271+00', '2025-04-21 12:06:33.129271+00', '2025-04-21 12:06:33.129271+00', '{"eTag": "\"cebf9a572993985a7808b0644694ddc5\"", "size": 254754, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:33.122Z", "contentLength": 254754, "httpStatusCode": 200}', '0b084d27-7d0f-4204-a2ed-6f9449175d77', NULL, '{}', 4),
	('0cdece18-5e70-4bd7-a9e1-fef19622da7c', 'meeting-documents', '1/11/23/SAFETY SECURITY-04-23-25-NAVIGATE 360 QUOTE W-169511.pdf', NULL, '2025-04-21 12:06:33.153863+00', '2025-04-21 12:06:33.153863+00', '2025-04-21 12:06:33.153863+00', '{"eTag": "\"4ccd3cbcf031e70d6b1791a02ad8eae4\"", "size": 110759, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2025-04-21T12:06:33.150Z", "contentLength": 110759, "httpStatusCode": 200}', '4820a80e-7025-491c-bddc-4a3fbfa90167', NULL, '{}', 4);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") VALUES
	('meeting-documents', '1', '2025-04-21 01:45:02.664776+00', '2025-04-21 01:45:02.664776+00'),
	('meeting-documents', '1/11', '2025-04-21 01:45:24.374196+00', '2025-04-21 01:45:24.374196+00'),
	('meeting-documents', '1/11/3', '2025-04-21 01:45:24.374196+00', '2025-04-21 01:45:24.374196+00'),
	('meeting-documents', '1/11/16', '2025-04-21 12:00:17.644122+00', '2025-04-21 12:00:17.644122+00'),
	('meeting-documents', '1/12', '2025-04-21 12:04:52.163954+00', '2025-04-21 12:04:52.163954+00'),
	('meeting-documents', '1/12/19', '2025-04-21 12:04:52.163954+00', '2025-04-21 12:04:52.163954+00'),
	('meeting-documents', '1/12/20', '2025-04-21 12:04:52.164416+00', '2025-04-21 12:04:52.164416+00'),
	('meeting-documents', '1/5', '2025-04-21 12:05:20.119519+00', '2025-04-21 12:05:20.119519+00'),
	('meeting-documents', '1/5/21', '2025-04-21 12:05:20.119519+00', '2025-04-21 12:05:20.119519+00'),
	('meeting-documents', '1/7', '2025-04-21 12:06:11.364005+00', '2025-04-21 12:06:11.364005+00'),
	('meeting-documents', '1/7/22', '2025-04-21 12:06:11.364005+00', '2025-04-21 12:06:11.364005+00'),
	('meeting-documents', '1/11/23', '2025-04-21 12:06:31.961712+00', '2025-04-21 12:06:31.961712+00');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 19, true);


--
-- Name: dashboard_user_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."dashboard_user_invites_id_seq"', 3, true);


--
-- Name: dashboards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."dashboards_id_seq"', 1, true);


--
-- Name: meeting_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."meeting_documents_id_seq"', 152, true);


--
-- Name: meeting_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."logs_id_seq"', 1, false);


--
-- Name: meetings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."meetings_id_seq"', 23, true);


--
-- Name: organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."organizations_id_seq"', 12, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
