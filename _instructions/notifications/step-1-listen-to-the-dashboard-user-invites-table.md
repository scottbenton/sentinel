I have already started on this notification feature. I have a database table (see supabase-generated.types.ts) called notifications.
I would like to start by inserting notifications whenever an invitation comes in for a user, using a supabase database webhook.

We need to

- Create a new method in the nestjs backend that the webhook can call that parses insert events on the dashboard_user_invites table. It should grab the email address of the invited user, the ID of the dashboard, the UID of the inviter, and the ID of the invite. It should then look through the `users` table to find a user with the email mentioned in the invite. If no user is found, it stops. If a user is found, it fetches the name of the dashboard (from `dashboards` table), the name of the inviting user (from the `users` table), and inserts a new notification into the `notifications` table, with the name of the table, the name of the inviter, and the id of the invite all passed as parameters to the notification.

## Supabase Payload docs

Since webhooks are just database triggers, you can also create one from SQL statement directly.

create trigger "my_webhook" after inserton "public"."my_table" for each rowexecute function "supabase_functions"."http_request"( 'http://host.docker.internal:3000', 'POST', '{"Content-Type":"application/json"}', '{}', '1000');

We currently support HTTP webhooks. These can be sent as POST or GET requests with a JSON payload.

Example payload

```
type InsertPayload = {  type: 'INSERT'  table: string  schema: string  record: TableRecord<T>  old_record: null}type UpdatePayload = {  type: 'UPDATE'  table: string  schema: string  record: TableRecord<T>  old_record: TableRecord<T>}type DeletePayload = {  type: 'DELETE'  table: string  schema: string  record: null  old_record: TableRecord<T>}
```
