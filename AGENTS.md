# Sentinel Architecture Documentation

> **Last Updated**: 2025-10-23
>
> **⚠️ IMPORTANT FOR AGENTS**: This document describes the architecture and patterns used in the Sentinel codebase. If you discover code that conflicts with this documentation, **UPDATE THIS FILE** to reflect reality. If you add substantial new features or patterns, **UPDATE THIS FILE** to document them. This is a living document that should always reflect the current state of the codebase.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Architecture](#database-architecture)
7. [Async Processing with BullMQ & Redis](#async-processing-with-bullmq--redis)
8. [Communication Patterns](#communication-patterns)
9. [Code Patterns & Conventions](#code-patterns--conventions)
10. [Security & Permissions](#security--permissions)
11. [Development Workflow](#development-workflow)

---

## Project Overview

**Sentinel** is a civic engagement application that helps activists monitor local government meetings. It automatically scrapes meeting information from government websites, organizes documents, and allows users to collaborate and comment on meetings.

### Key Features
- Dashboard-based organization for tracking multiple government entities
- Automated web scraping of meeting agendas and documents
- Real-time collaboration with comments and activity logs
- In-app notifications system
- User invitations and permission management
- Document storage and management

---

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **State Management**: Zustand with Immer middleware
- **UI Library**: Chakra UI v3
- **Routing**: Wouter (lightweight React router)
- **Forms**: React Hook Form with Yup validation
- **Rich Text Editor**: TipTap with extensions
- **Icons**: Lucide React
- **Date Formatting**: date-fns

### Backend
- **Framework**: NestJS with TypeScript
- **Runtime**: Node.js
- **Task Queue**: BullMQ
- **Message Broker**: Redis (for BullMQ)
- **Scheduling**: @nestjs/schedule (cron jobs)
- **Web Scraping**: Playwright
- **Email**: Nodemailer with Handlebars templates
- **AI Integration**: OpenAI API
- **Authentication**: JWT with Supabase Auth

### Database & Infrastructure
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime (PostgreSQL Change Data Capture)
- **Authentication**: Supabase Auth (OTP via email)
- **Storage**: Supabase Storage for documents
- **Webhooks**: Database triggers → HTTP webhooks to backend

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest

---

## Architecture Overview

Sentinel uses a **client-server architecture** with real-time synchronization:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                           │
│                                                                   │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ Components  │───▶│   Stores     │───▶│  Services    │       │
│  │   (UI)      │    │  (Zustand)   │    │              │       │
│  └─────────────┘    └──────────────┘    └──────┬───────┘       │
│                                                  │                │
│                                         ┌────────▼─────────┐     │
│                                         │  Repositories    │     │
│                                         └────────┬─────────┘     │
└──────────────────────────────────────────────────┼───────────────┘
                                                   │
                                    ┌──────────────▼──────────────┐
                                    │   Supabase Client SDK       │
                                    └──────────────┬──────────────┘
                                                   │
┌──────────────────────────────────────────────────┼───────────────┐
│                      SUPABASE PLATFORM           │               │
│                                                   │               │
│  ┌────────────────────────────────────────────────▼─────────┐   │
│  │              PostgreSQL Database                         │   │
│  │  - Row Level Security (RLS)                              │   │
│  │  - Database Triggers                                     │   │
│  │  - Real-time Change Data Capture                         │   │
│  └────────────┬─────────────────────────────────────────────┘   │
│               │                                                  │
│               ├─────▶ Realtime (WebSocket) ─────────────────────┼──▶ Client
│               │                                                  │
│               └─────▶ HTTP Webhooks ──────────────┐             │
│                                                     │            │
└─────────────────────────────────────────────────────┼────────────┘
                                                      │
┌─────────────────────────────────────────────────────▼────────────┐
│                    BACKEND (NestJS)                              │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Webhooks    │    │   Services   │    │  Supabase    │      │
│  │  Controller  │───▶│              │───▶│  Service     │      │
│  └──────────────┘    └──────┬───────┘    └──────────────┘      │
│                              │                                   │
│                              ▼                                   │
│                      ┌───────────────┐                           │
│                      │   BullMQ      │                           │
│                      │   Queues      │                           │
│                      └───────┬───────┘                           │
│                              │                                   │
│  ┌───────────────────────────▼──────────────────────────┐       │
│  │              Redis Message Broker                     │       │
│  └───────────────────────┬────────────────────────────────┘      │
│                          │                                       │
│  ┌───────────────────────▼──────────────────────────┐           │
│  │         BullMQ Workers (Processors)              │           │
│  │  - Scraper Processor (web scraping jobs)        │           │
│  │  - Scheduled jobs (cron)                         │           │
│  └──────────────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Layered Architecture Pattern

The frontend follows a strict **4-layer architecture**:

```
Component Layer (UI)
       ↓
Store Layer (State Management)
       ↓
Service Layer (Business Logic)
       ↓
Repository Layer (Data Access)
       ↓
Supabase Client
```

#### 1. Repository Layer (`/src/repository/*.repository.ts`)

**Purpose**: Direct database access and real-time subscriptions

**Responsibilities**:
- Execute Supabase queries (SELECT, INSERT, UPDATE, DELETE)
- Set up real-time subscriptions
- Handle database errors
- Return DTOs (Data Transfer Objects - raw database types)

**Pattern**:
```typescript
export class SomeRepository {
    private static table = () => supabase.from("table_name");

    public static async getItem(id: number): Promise<SomeDTO | null> {
        const { data, error, status } = await this.table()
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) {
            throw getRepositoryError(error, ErrorVerb.Read, ErrorNoun.Item, false, status);
        }

        return data;
    }

    public static subscribeToItem(
        filter: string,
        callback: (payload: any) => void
    ): () => void {
        return createSubscription(
            "channel-name",
            "table_name",
            filter,
            async () => await this.loadInitialData(),
            callback
        );
    }
}
```

**Key Files**:
- `_repositoryErrors.ts` - Centralized error handling
- `_subscriptionManager.ts` - Real-time subscription helper

#### 2. Service Layer (`/src/services/*.service.ts`)

**Purpose**: Business logic and data transformation

**Responsibilities**:
- Convert DTOs to domain models (IModel types)
- Implement business rules
- Aggregate multiple repository calls
- Provide clean API for stores

**Pattern**:
```typescript
export interface IModel {
    id: number;
    name: string;
    createdAt: Date; // Transformed from string
}

export class SomeService {
    public static async getItem(id: number): Promise<IModel | null> {
        const dto = await SomeRepository.getItem(id);
        if (!dto) return null;
        return this.convertDTOToModel(dto);
    }

    private static convertDTOToModel(dto: SomeDTO): IModel {
        return {
            id: dto.id,
            name: dto.name,
            createdAt: new Date(dto.created_at), // Transform
        };
    }

    public static subscribeToItem(
        id: number,
        onUpdate: (item: IModel) => void
    ): () => void {
        return SomeRepository.subscribeToItem(
            `id=eq.${id}`,
            (dto) => onUpdate(this.convertDTOToModel(dto))
        );
    }
}
```

#### 3. Store Layer (`/src/stores/*.store.ts`)

**Purpose**: Client-side state management

**Responsibilities**:
- Hold application state
- Manage real-time subscriptions
- Trigger service calls
- Provide selectors for components

**Pattern**:
```typescript
export interface StoreState {
    items: Record<number, IModel>;
    loading: boolean;
    error: string | null;
}

export interface StoreActions {
    loadItem: (id: number) => Promise<void>;
    subscribeToItem: (id: number) => () => void;
    resetStore: () => void;
}

const defaultState: StoreState = {
    items: {},
    loading: false,
    error: null,
};

export const useItemStore = createWithEqualityFn<StoreState & StoreActions>()(
    immer((set) => ({
        ...defaultState,

        loadItem: async (id: number) => {
            set({ loading: true, error: null });
            try {
                const item = await SomeService.getItem(id);
                set((state) => {
                    if (item) state.items[item.id] = item;
                    state.loading = false;
                });
            } catch (error: any) {
                set({ error: error.message, loading: false });
            }
        },

        subscribeToItem: (id: number) => {
            return SomeService.subscribeToItem(id, (item) => {
                set((state) => {
                    state.items[item.id] = item;
                });
            });
        },

        resetStore: () => set(defaultState),
    })),
    deepEqual // Prevent unnecessary re-renders
);

// Sync hook for automatic subscription
export function useSyncItem(itemId: number | null) {
    const subscribeToItem = useItemStore((s) => s.subscribeToItem);

    useEffect(() => {
        if (itemId) return subscribeToItem(itemId);
    }, [itemId, subscribeToItem]);
}
```

#### 4. Component Layer (`/src/components/**/*.tsx`)

**Purpose**: UI rendering and user interaction

**Responsibilities**:
- Render UI using Chakra UI components
- Handle user events
- Subscribe to stores for state
- Use sync hooks to activate subscriptions

**Pattern**:
```typescript
export function ItemView({ itemId }: { itemId: number }) {
    // Sync hook - activates subscription
    useSyncItem(itemId);

    // Select only needed state (prevents unnecessary re-renders)
    const item = useItemStore((s) => s.items[itemId]);
    const loading = useItemStore((s) => s.loading);

    if (loading) return <ProgressBar />;
    if (!item) return <EmptyState />;

    return (
        <Box>
            <Heading>{item.name}</Heading>
            <Text>{formatDate(item.createdAt)}</Text>
        </Box>
    );
}
```

### Real-time Subscriptions

Sentinel uses **Supabase Realtime** for live updates:

**Subscription Manager** (`_subscriptionManager.ts`):
```typescript
createSubscription(
    channelName: string,          // Unique channel ID
    table: string,                 // Database table
    filter: string,                // RLS filter (e.g., "user_id=eq.123")
    loadInitialData: () => Promise<any>, // Initial data load
    onPayload: (type, payload) => void   // Event handler
)
```

**Events**:
- `initial` - Initial data loaded
- `INSERT` - New row added
- `UPDATE` - Row updated
- `DELETE` - Row deleted

**Lifecycle**:
1. Component mounts → calls sync hook
2. Sync hook → calls store subscribe method
3. Store → calls service subscribe
4. Service → calls repository subscribe
5. Repository → creates subscription
6. Subscription loads initial data
7. Subscription listens to PostgreSQL changes
8. Changes propagate up: Repository → Service → Store → Component

**Cleanup**:
- Subscriptions return an unsubscribe function
- useEffect cleanup calls unsubscribe
- Prevents memory leaks

---

## Backend Architecture

### NestJS Module System

The backend is organized into **feature modules**:

```
functions/src/
├── app.module.ts              # Root module
├── supabase/                  # Supabase service
│   ├── supabase.module.ts
│   └── supabase.service.ts
├── webhooks/                  # Database webhook handlers
│   ├── webhooks.module.ts
│   ├── webhooks.controller.ts
│   └── webhooks.service.ts
├── scraper/                   # Web scraping
│   ├── scraper.module.ts
│   ├── scraper.controller.ts
│   ├── scraper.service.ts     # Queue management
│   ├── scraper.processor.ts   # BullMQ worker
│   └── scrapers/              # Site-specific scrapers
├── meetings/                  # Meeting logic
│   ├── meetings.module.ts
│   └── meetings.service.ts
├── organizations/             # Organization logic
│   ├── organizations.module.ts
│   └── organizations.service.ts
├── dashboard_users/           # User management
├── email/                     # Email service
└── types/
    └── supabase-generated.types.ts
```

### Dependency Injection

NestJS uses **dependency injection** for services:

```typescript
@Injectable()
export class WebhooksService {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly watchersService: WatchersService
    ) {}
}
```

**Benefits**:
- Testability (easy to mock dependencies)
- Decoupling (services don't create dependencies)
- Single responsibility

### Supabase Service

**Purpose**: Centralized Supabase client with service role key

**File**: `functions/src/supabase/supabase.service.ts`

```typescript
@Injectable()
export class SupabaseService {
    public readonly supabase: SupabaseClient<Database>;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY // Full access
        );
    }
}
```

**Usage**: Injected into all services that need database access

---

## Database Architecture

### Supabase PostgreSQL

**Core Tables**:

```
users
├── id (UUID, from auth.users)
├── email_address
├── display_name
└── created_at

dashboards
├── id (bigint)
├── label
└── created_at

dashboard_users (many-to-many)
├── user_id (FK → users)
├── dashboard_id (FK → dashboards)
├── is_admin
├── can_manage_users
├── can_manage_meetings
└── created_at

organizations
├── id (bigint)
├── dashboard_id (FK → dashboards)
├── name
├── url
├── description
├── sync_pending
├── last_synced
├── sync_error
└── created_at

meetings
├── id (bigint)
├── organization_id (FK → organizations)
├── name
├── meeting_date
├── created_by (FK → users)
└── created_at

meeting_documents
├── id (bigint)
├── meeting_id (FK → meetings)
├── filename
├── file_hash
├── created_by (FK → users)
└── created_at

logs (activity logs)
├── id (bigint)
├── meeting_id (FK → meetings, nullable)
├── org_id (FK → organizations, nullable)
├── type (enum: lifecycle, comment, meeting_created, etc.)
├── text
├── additional_context (JSONB)
├── is_bot_action
├── created_by (FK → users)
├── edited_at
└── created_at

notifications
├── id (UUID)
├── type (enum: meeting_created, comment_added, etc.)
├── user_id (FK → users)
├── log_id (FK → logs, nullable)
├── additional_context (JSONB)
├── has_been_read
└── created_at

notification_settings
├── id (bigint)
├── user_id (FK → users)
├── dashboard_id (FK → dashboards, nullable)
├── organization_id (FK → organizations, nullable)
├── meeting_id (FK → meetings, nullable)
├── settings (JSONB)
└── created_at
```

### Row-Level Security (RLS)

**All tables have RLS enabled**. Users can only access data they have permission to see.

**Example policies**:
```sql
-- Users can only read their own notifications
CREATE POLICY "Users can read their notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

-- Users can only access dashboards they're members of
CREATE POLICY "Dashboard access via membership"
    ON dashboards FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM dashboard_users
            WHERE dashboard_id = dashboards.id
            AND user_id = auth.uid()
        )
    );
```

### Database Triggers & Webhooks

**Pattern**: PostgreSQL triggers → HTTP POST to NestJS

**Example**:
```sql
CREATE TRIGGER "dashboard_user_invites-insert"
    AFTER INSERT ON dashboard_user_invites
    FOR EACH ROW
    EXECUTE FUNCTION supabase_functions.http_request(
        'http://host.docker.internal:3000/webhooks/dashboard-user-invites/insert',
        'POST',
        '{"Content-type":"application/json"}',
        '{}',
        '5000'
    );
```

**Backend handler**:
```typescript
@Post("/dashboard-user-invites/insert")
async handleInviteInsert(@Body() payload: any): Promise<void> {
    this.logger.log("Received invite insert webhook");
    await this.webhooksService.handleInviteInsert(payload);
}
```

**When to use**:
- Creating notifications based on database events
- Post-processing after inserts/updates/deletes
- Keeping derived data in sync

---

## Async Processing with BullMQ & Redis

### Overview

Sentinel uses **BullMQ** (built on Redis) for **background job processing**. This is critical for long-running tasks like web scraping.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                        │
│                                                              │
│  ┌────────────────┐         ┌──────────────────┐           │
│  │    Service     │         │     Processor    │           │
│  │  (Producer)    │         │    (Consumer)    │           │
│  │                │         │                  │           │
│  │  Adds jobs ────┼────┐    │  ┌──── Executes │           │
│  │  to queue      │    │    │  │     jobs      │           │
│  └────────────────┘    │    │  │               │           │
│                        │    │  │               │           │
└────────────────────────┼────┼──┼───────────────────────────┘
                         │    │  │
                         ▼    │  ▼
                    ┌────────────────────┐
                    │   Redis Server     │
                    │                    │
                    │  ┌──────────────┐  │
                    │  │ Job Queue    │  │
                    │  │ - job 1      │  │
                    │  │ - job 2      │  │
                    │  │ - job 3      │  │
                    │  └──────────────┘  │
                    └────────────────────┘
```

### Redis Configuration

**Connection** (in `app.module.ts`):
```typescript
BullModule.forRoot({
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? ""),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
})
```

**Environment variables needed**:
- `REDIS_HOST` - Redis server hostname
- `REDIS_PORT` - Redis server port (usually 6379)
- `REDIS_USERNAME` - Redis username (optional)
- `REDIS_PASSWORD` - Redis password

### Creating a Queue

**1. Register the queue in a module**:
```typescript
@Module({
    imports: [
        BullModule.registerQueue({
            name: "organization-scrape-queue",
        }),
    ],
    providers: [ScraperService, ScraperProcessor],
})
export class ScraperModule {}
```

**2. Inject the queue into a service (Producer)**:
```typescript
@Injectable()
export class ScraperService {
    constructor(
        @InjectQueue("organization-scrape-queue")
        private readonly organizationScrapeQueue: Queue
    ) {}

    async addOrganizationToQueue(organizationId: number): Promise<void> {
        await this.organizationScrapeQueue.add(
            "scrape-organization",  // Job name
            { organizationId },     // Job data
            {
                jobId: `organization-${organizationId}`, // Unique ID (prevents duplicates)
                removeOnComplete: true, // Clean up after completion
                removeOnFail: true,     // Clean up after failure
            }
        );
    }
}
```

**3. Create a processor (Consumer)**:
```typescript
@Processor({ name: "organization-scrape-queue", scope: Scope.REQUEST })
export class ScraperProcessor extends WorkerHost {
    private readonly logger = new Logger(ScraperProcessor.name);

    constructor(
        private readonly organizationService: OrganizationsService,
        private readonly meetingsService: MeetingsService
    ) {
        super();
    }

    async process(job: Job<{ organizationId: string }, any, string>) {
        const { organizationId } = job.data;

        this.logger.log(`Processing job for organization ${organizationId}`);

        // Long-running task here (e.g., web scraping)
        // ...

        this.logger.log(`Finished job for organization ${organizationId}`);

        return {};
    }
}
```

### Current Queues

#### 1. Organization Scrape Queue (`organization-scrape-queue`)

**Purpose**: Web scraping of government websites

**Producer**: `ScraperService`
- `addOrganizationToQueue(organizationId)` - Manually trigger scrape
- `runAllSyncJobs()` - Cron job (daily at 1 PM ET)

**Consumer**: `ScraperProcessor`
- Launches Playwright browser
- Detects appropriate scraper (BoardDocs, GarnetValley, PennDelco, Ridley)
- Scrapes meeting data and documents
- Uploads documents to Supabase Storage
- Updates organization sync status

**Job Data**:
```typescript
{
    organizationId: string
}
```

**Job Options**:
```typescript
{
    jobId: `organization-${organizationId}`, // Prevents duplicate jobs
    removeOnComplete: true,
    removeOnFail: true,
}
```

**Scheduled Job**: Runs daily at 1 PM Eastern Time
```typescript
@Cron(CronExpression.EVERY_DAY_AT_1PM, { timeZone: "America/New_York" })
async runAllSyncJobs() {
    // Queues all organizations for scraping
}
```

### BullMQ Best Practices

**When to use BullMQ**:
- Long-running tasks (> 5 seconds)
- CPU-intensive operations
- Tasks that can fail and need retry logic
- Tasks that need to be rate-limited
- Scheduled/recurring tasks

**When NOT to use BullMQ**:
- Simple database operations (< 1 second)
- Real-time user-facing operations
- Tasks that must complete immediately

**Job naming conventions**:
- Use descriptive job names: `"scrape-organization"` not `"job1"`
- Use unique `jobId` to prevent duplicates: `organization-${id}`

**Error handling**:
- Jobs automatically retry on failure
- Log errors clearly in processor
- Update database status on failure (e.g., `sync_error` field)

**Cleanup**:
- Use `removeOnComplete: true` to prevent Redis bloat
- Use `removeOnFail: true` unless you need to debug failures

---

## Communication Patterns

### 1. Client → Server (REST)

**Used for**: User-initiated actions requiring server-side logic

**Example**: Starting a scrape job
```typescript
// Frontend
const response = await fetch("/api/scraper/scrape", {
    method: "POST",
    body: JSON.stringify({ organizationId }),
});

// Backend
@Post("/scrape")
async scrape(@Body() body: { organizationId: number }) {
    await this.scraperService.addOrganizationToQueue(body.organizationId);
}
```

### 2. Client ↔ Supabase (Direct)

**Used for**: Reading/writing data, real-time subscriptions

**Example**: Reading meetings
```typescript
const { data } = await supabase
    .from("meetings")
    .select("*")
    .eq("organization_id", orgId);
```

### 3. Database → Backend (Webhooks)

**Used for**: Triggering server logic on database changes

**Flow**:
1. Row inserted/updated/deleted in PostgreSQL
2. Database trigger fires
3. HTTP POST sent to NestJS endpoint
4. Backend processes event (create notification, send email, etc.)

### 4. Backend → Queue → Worker

**Used for**: Async processing of long-running tasks

**Flow**:
1. Service adds job to queue
2. Redis stores job
3. Worker picks up job
4. Worker processes job
5. Worker updates database

---

## Code Patterns & Conventions

### Naming Conventions

**Files**:
- `.repository.ts` - Repository layer
- `.service.ts` - Service layer
- `.store.ts` - Zustand store
- `.tsx` - React component
- `.module.ts` - NestJS module
- `.controller.ts` - NestJS controller
- `.processor.ts` - BullMQ worker

**Functions**:
- `useSyncXxx()` - React hook for subscription
- `useXxxStore()` - Zustand store hook
- `getXxx()` / `createXxx()` / `updateXxx()` / `deleteXxx()` - CRUD operations

**Interfaces**:
- `IModel` - Domain model (frontend)
- `ModelDTO` - Database DTO (from Supabase types)
- `ModelInsertDTO` - Insert DTO
- `ModelUpdateDTO` - Update DTO

### Type Safety

**Frontend**:
- Auto-generated types from Supabase: `src/types/supabase-generated.types.ts`
- Custom domain models in services
- Strict TypeScript mode enabled

**Backend**:
- Auto-generated types from Supabase: `functions/src/types/supabase-generated.types.ts`
- NestJS decorators for validation
- Strict TypeScript mode enabled

**Regenerating types**:
```bash
# In project root
npx supabase gen types typescript --project-id <project-id> > src/types/supabase-generated.types.ts
```

### Error Handling

**Frontend**:
```typescript
// Repository layer
if (error) {
    throw getRepositoryError(
        error,
        ErrorVerb.Read,
        ErrorNoun.Meetings,
        false,
        status
    );
}

// Store layer
try {
    await SomeService.doSomething();
} catch (error: any) {
    set({ error: error.message });
}
```

**Backend**:
```typescript
try {
    await this.doSomething();
} catch (error) {
    this.logger.error("Error doing something:", error);
    throw new Error("User-friendly error message");
}
```

### State Management with Zustand + Immer

**Key pattern**:
```typescript
export const useStore = createWithEqualityFn<State & Actions>()(
    immer((set, get) => ({
        // State
        items: {},

        // Actions
        addItem: (item) => {
            set((state) => {
                // Immer makes this immutable behind the scenes
                state.items[item.id] = item;
            });
        },
    })),
    deepEqual // Prevents re-renders on shallow changes
);
```

**Why Immer?**
- Write mutable-looking code that's actually immutable
- Safer than spread operators for nested updates
- More readable

**Why deepEqual?**
- Zustand normally uses reference equality
- Deep equality prevents re-renders when object contents haven't changed

---

## Security & Permissions

### Row-Level Security (RLS)

**All tables MUST have RLS enabled**:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Policy types**:
- `FOR SELECT` - Read access
- `FOR INSERT` - Create access
- `FOR UPDATE` - Update access
- `FOR DELETE` - Delete access

**Common patterns**:
```sql
-- Users can only see their own data
USING (user_id = auth.uid())

-- Users can only access dashboards they're members of
USING (
    EXISTS (
        SELECT 1 FROM dashboard_users
        WHERE dashboard_id = table_name.dashboard_id
        AND user_id = auth.uid()
    )
)
```

### Authentication

**Client-side**: Supabase Auth
- Magic link (OTP) via email
- Session stored in localStorage
- Auto-refresh of tokens

**Backend**: Service role key
- Full database access (bypasses RLS)
- Used for webhooks and background jobs
- Never exposed to client

### Authorization

**Dashboard-level permissions**:
- `is_admin` - Full dashboard control
- `can_manage_users` - Invite/remove users
- `can_manage_meetings` - Create/edit meetings

**Checked in**:
- Frontend: UI shows/hides features
- Backend: Validates permissions before operations
- Database: RLS policies enforce access

---

## Development Workflow

### Project Structure

```
sentinel/
├── src/                        # Frontend source
│   ├── components/            # React components
│   ├── services/              # Business logic
│   ├── repository/            # Data access
│   ├── stores/                # Zustand stores
│   ├── notifications/         # Notification system
│   ├── types/                 # TypeScript types
│   └── lib/                   # Utilities
├── functions/                  # Backend source
│   └── src/
│       ├── webhooks/          # Webhook handlers
│       ├── scraper/           # Web scraping
│       ├── meetings/          # Meeting logic
│       ├── organizations/     # Organization logic
│       └── types/             # TypeScript types
├── supabase/                   # Database
│   ├── migrations/            # SQL migrations
│   └── config.toml            # Supabase config
├── plan.md                     # Feature implementation plan
├── AGENTS.md                   # This file
└── README.md                   # Project overview
```

### Running Locally

**Frontend**:
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend**:
```bash
cd functions
npm install
npm run start:dev
# Runs on http://localhost:3000
```

**Database**:
```bash
npx supabase start
# Runs local Supabase stack
```

### Build & Test Verification

**⚠️ IMPORTANT**: After making changes to either the frontend or backend, you MUST verify that builds and tests pass before considering work complete.

**Frontend verification**:
```bash
# Run tests
npm test -- --run

# Run build
npm run build
```

**Backend verification**:
```bash
cd functions

# Run tests
npm test

# Run build
npm run build
```

**When to verify**:
- After adding new features
- After modifying existing code
- After updating dependencies
- Before committing changes
- Before marking tasks as complete

**What to check**:
- ✅ All tests pass (no failures)
- ✅ Build completes without errors
- ✅ No TypeScript errors
- ✅ No unused variables/imports warnings (these fail builds)

**Common build errors to fix**:
- Unused imports → Remove them
- Unused variables → Prefix with `_` or remove
- Type errors → Fix type mismatches
- Missing dependencies → Install them

### Adding a New Feature

**Recommended order**:
1. **Database**: Create migration in `supabase/migrations/`
2. **Backend**: Add services, webhooks, processors
3. **Frontend**: Repository → Service → Store → Components
4. **Testing**: Verify functionality
5. **Documentation**: Update this file if adding new patterns

### Database Migrations

**Creating a migration**:
```bash
npx supabase migration new description_of_change
```

**Applying migrations**:
```bash
npx supabase db push
```

**Regenerating types**:
```bash
npx supabase gen types typescript --local > src/types/supabase-generated.types.ts
npx supabase gen types typescript --local > functions/src/types/supabase-generated.types.ts
```

---

## Key Learnings for Agents

### ✅ DO

- **Follow the layer pattern**: Repository → Service → Store → Component
- **Use Immer for state updates**: Makes immutable updates easier
- **Use RLS policies**: Never bypass security
- **Use webhooks for database events**: Keep backend in sync
- **Use BullMQ for long tasks**: Don't block HTTP requests
- **Update this file**: If you find conflicts or add features
- **Use TypeScript strictly**: Leverage auto-generated types
- **Subscribe to real-time changes**: Users expect live updates
- **Clean up subscriptions**: Prevent memory leaks

### ❌ DON'T

- **Don't skip layers**: Always go through the proper abstraction
- **Don't mutate state directly**: Use Immer/Zustand patterns
- **Don't expose service role key**: Keep it server-side only
- **Don't make frontend calls from backend**: Backend should be self-contained
- **Don't create duplicate subscriptions**: One per component lifecycle
- **Don't ignore errors**: Always handle and log them
- **Don't bypass RLS**: Even for "admin" operations
- **Don't put business logic in components**: Keep them in services

### Common Pitfalls

1. **Forgetting to enable RLS**: All new tables need RLS enabled
2. **Not cleaning up subscriptions**: Causes memory leaks
3. **Mixing DTO and domain types**: Keep them separate
4. **Not using deep equality in stores**: Causes unnecessary re-renders
5. **Blocking operations with sync code**: Use BullMQ for async tasks
6. **Hardcoding URLs/IDs**: Use environment variables

---

## Updating This Document

**When to update**:
- Adding a new architectural pattern
- Changing how a layer works
- Adding a new queue or background job
- Modifying database schema significantly
- Finding documentation that conflicts with code

**How to update**:
1. Find the relevant section
2. Update with accurate information
3. Add examples if helpful
4. Update the "Last Updated" date at the top

**This is a living document. Keep it alive.**

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [BullMQ Documentation](https://docs.bullmq.io)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Chakra UI Documentation](https://www.chakra-ui.com/docs)
- [React Documentation](https://react.dev)

---

**End of Architecture Documentation**
