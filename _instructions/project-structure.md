# Project Structure

The project is built in two parts - the root folder is a react vite structure using typescript. The code for the frontend is in the `src` folder. It uses Zustand for state management, chakra ui for styling and components, and wouter for routing. Please follow established convention wherever possible (for example, on the frontend, I use `.repository.ts` files to interact with supabase directly, `.service.ts` files to transform the raw supabase types into application-specific structure, and then `.store.ts` files to manage the integration between the service layer and state management)

The backend is in the `functions` folder. It is a nestjs project using typescript.

We use supabase for Auth, storage, and database. You can view existing database types in the `supabase-generated.types.ts` files.
