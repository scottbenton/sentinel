![Contributing](./markdown-assets/Contributing.png)

## Setup Steps

### To run the frontend

1. Clone this project locally
2. Install node and npm

   1. Follow [these instructions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to install nvm
   2. Switch to project dir and `nvm install` to install and configure the correct node version

3. Follow these instructions to [install docker](https://www.docker.com/get-started/)
4. Install the project dependencies `npm i`
5. Create a `.env.local` file (see frontend .env.local below)
6. Run supabase locally (see Supabase Setup below)
7. Start the UI by running `npm run dev`, and follow the link to your browser to access the development environment.

### To run the backend

1. Install [redis](https://redis.io/) locally
2. Install project dependencies `cd functions && npm i`
3. Setup a `.env` file in the functions directory (see backend .env below)

### Frontend .env.local

Create a new file in the root of this repository, named `.env.local`. This file will hold environment variables representing credentials needed to connect your instance with supabase.

Copy the following into your `.env.local` file

```
VITE_SUPABASE_URL=http://localhost:54321 # Yours might be different, but this is the default
VITE_SUPABASE_ANON_KEY=RANDOM_KEY_HERE # This key will be spit out by the supabase CLI when starting it for the first time
```

As you start up supabase locally, you will get values to fill these config values in.

### Backend .env

Create a new file in the `functions` directory, named `.env`.
This file holds environment variables needed to connect the backend to redis, supabase, and OpenAI.

Copy the following into your `.env` file.

```
OPENAI_API_KEY= # Get your own from OpenAI
SUPABASE_URL=http://localhost:44321
SUPABASE_SERVICE_ROLE_KEY= # Copy from the supabase CLI after starting
SUPABASE_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
REDIS_HOST = localhost
REDIS_PORT = 6379 # Change if your Redis cache is placed elsewhere
```

### Supabase Setup

Supabase provides authentication, database, and file storage to this application.

The first step is to start the local version of supabase. Make sure you have docker installed and running on your machine, then run `npm run supabase:start` in order to launch the docker containers. Once your local development setup has started, it should output a bunch of URLs and keys into the console. You need to copy the value of the `API URL:` and the `anon key:` into your `.env.local` file in order for the UI to be able to communicate with Supabase.

Supabase comes with a handy admin console that allows you to check in and configure different portions of your application. Once supabase is running, you can visit the console at [localhost:44323](http://localhost:44323/project/default). While in the local development environment, outgoing emails (including ones for authentication) are captured by mailpit. You can open mailpit at [localhost:44324](http://localhost:44324/) to view these emails.

Once supabase is up and running, you should create a storage bucket for meeting documents. Open the supabase console, navigate to storage, and click "New Bucket". Fill in the following information, and click save.

![Storage Bucket configuration](./markdown-assets/meeting-documents-bucket.png)

## Structure

### UI Code

#### Folder Structure

The UI code is structured into a few top level folders for easy access

| Folder Name   | Usage                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assets        | Used for things like one-off icons that we can't get from our icon library                                                                                                            |
| components    | Used for components that are shared throughout the app.                                                                                                                               |
| components/ui | These components are managed by Chakra-UI. We can make changes here, but generally shouldn't need to                                                                                  |
| hooks         | Useful react hooks that can be reused across pages                                                                                                                                    |
| lib           | Helper functions & configuration                                                                                                                                                      |
| pages         | Contains the components used to render out specific pages to the UI (less specific components go in components, more specific go here)                                                |
| providers     | React context providers that wrap the entire application go here                                                                                                                      |
| repository    | This level handles the connection to supabase. The goal here is that, if necessary, we could rip out supabase and change to a different backend without needing to change other files |
| service       | Wraps repository classes into nice, business logic layers                                                                                                                             |
| stores        | Wraps services into react hooks using zustand                                                                                                                                         |
| types         | Currently just contains the auto generated supabase types                                                                                                                             |

#### External Libraries

| Dependency                                                                              | Purpose                                                                                                     |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Chakra UI](https://www.chakra-ui.com/docs/)                                            | Component library & css styling (via emotion)                                                               |
| [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)                    | Handles global react application state in a way that prevents unnecessary re-renders (unlike react context) |
| [Supabase-JS](https://supabase.com/docs/reference/javascript/start)                     | Client library for supabase, allows us to easily make backend calls against our database & storage layers   |
| [React Hook Form](https://react-hook-form.com/) / [yup](https://github.com/jquense/yup) | Used for forms & form validation across the application                                                     |
| [Lucide](https://lucide.dev/icons/)                                                     | Icon library used for most icons in the application                                                         |

### Backend Code

Backend code is (mostly) handled via supabase, at least for basic CRUD operations.

Once we get into CRON jobs and long running tasks, we will need to break some of the logic out into other services. [Trigger.dev](https://trigger.dev) has a generous free tier and an easy connection to Supabase, but others would work just as well!

## Making changes in Supabase

If you make a change to a table, you can update the typescript types by running `npm run supabase:gen-types`.

After you are finished making changes you should create a database migration file by running `npm run supabase:create-db-script`. If you have made changes to file storage, run `npm run supabase:create-storage-script`.

If a new migration has been added, you will need to run `npm run supabase:reset-db` in order to get the new changes. This will, unfortunately, wipe your local database and storage files.
