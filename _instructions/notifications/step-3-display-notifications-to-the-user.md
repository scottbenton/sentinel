We now want to enable users to view notifications on the frontend.

Viewing notifications should come with a few basic actions, depending on the notification type.

For invite notifications, we want the user to be able to accept or decline the invite from the notification shade.
If the user clicks "accept" we want to take them to the accept route. If they decline, we want to delete the notification.

If the notification is not an invite notification, we can ignore it for now (skip rendering).

Here are the following parameters for this story:

- Use chakra-ui components whenever possible.
- Use lucide icons for the notification bell
- Place the notification in the navigation bar.
- Whenever a user has unread notifications, place a badge on top of the notification button
- Clicking the notification button should open up a menu that shows users their most recent notifications, and the actions they can take on these notifications.
- We should use supabase realtime to be able to keep track of a users notifications. Make sure we use the `notification.store` `notification.service` `notification.repository` structure on the frontend to keep the code organized.
