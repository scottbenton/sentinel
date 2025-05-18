Now we want to ensure that when a user creates an account, we look for any pending invites with their email, and add them as notifications. We also want to make sure that when an invite is removed from the database that we also delete any related notifications

Can we create two new webhook endpoints:

1: for inserts on the user table, create notifications for any dashboard_user_invites with matching emails?
2: for deletes on the dashboard_user_invites table, delete notifications for any matching invite ids?
