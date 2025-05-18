import { toaster } from "@/components/ui/toaster";
import { StorageApiError } from "@supabase/storage-js";
import { isAuthError } from "@supabase/supabase-js";

export enum ErrorNoun {
  User = "user",
  UserInvites = "user invites",
  Dashboards = "dashboards",
  Organizations = "organizations",
  Meetings = "meetings",
  MeetingDocuments = "meeting documents",
  MeetingLogs = "meeting logs",
  NotificationSettings = "notification settings",
  Notifications = "notifications",
}

export enum ErrorVerb {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
  Upload = "upload",
}

export enum ErrorReason {
  BadRequest = "BAD_REQUEST",
  NotAuthorized = "NOT_AUTHORIZED",
  Forbidden = "FORBIDDEN",
  NotFound = "NOT_FOUND",
  TimedOut = "TIMED_OUT",
  RateLimited = "RATE_LIMITED",
  ServerError = "SERVER_ERROR",
  Unknown = "UNKNOWN",
}

export class RepositoryError extends Error {
  originalMessage?: string;
  reason: ErrorReason;
  verb: ErrorVerb;
  noun: ErrorNoun;
  plural: boolean;

  constructor(
    reason: ErrorReason,
    verb: ErrorVerb,
    noun: ErrorNoun,
    plural: boolean,
    originalMessage?: string,
  ) {
    super(`Failed to ${verb} ${noun}: ${reason}`);
    this.name = this.constructor.name;
    this.reason = reason;
    this.verb = verb;
    this.noun = noun;
    this.plural = plural;
    this.originalMessage = originalMessage;
  }
}

export function getRepositoryError(
  error: unknown,
  verb: ErrorVerb,
  noun: ErrorNoun,
  plural: boolean,
  status?: number,
): RepositoryError {
  let reason = ErrorReason.Unknown;
  let message: string | undefined;

  if (status) {
    reason = convertHttpStatusCodeToErrorReason(status);
  }

  if (isAuthError(error) || error instanceof StorageApiError) {
    if (error.status) {
      reason = convertHttpStatusCodeToErrorReason(error.status);
    }
  }

  if (error instanceof Error) {
    message = error.message;
  }
  if (typeof error === "string") {
    message = error;
  }
  if (Array.isArray(error)) {
    message = error.join(", ");
  }

  const repositoryError = new RepositoryError(
    reason,
    verb,
    noun,
    plural,
    message,
  );

  parseRepositoryErrorAndCreateToast(repositoryError);

  return repositoryError;
}

export function convertHttpStatusCodeToErrorReason(code: number): ErrorReason {
  if (code === 400) {
    return ErrorReason.BadRequest;
  } else if (code === 401) {
    return ErrorReason.NotAuthorized;
  } else if (code === 403) {
    return ErrorReason.Forbidden;
  } else if (code === 404) {
    return ErrorReason.NotFound;
  } else if (code === 408 || code === 504) {
    return ErrorReason.TimedOut;
  } else if (code === 429) {
    return ErrorReason.RateLimited;
  } else if (code === 500) {
    return ErrorReason.ServerError;
  } else {
    return ErrorReason.Unknown;
  }
}

function parseRepositoryErrorAndCreateToast(error: RepositoryError) {
  toaster.create({
    title: parseRepositoryErrorAndGetText(error),
    type: "error",
  });
}

export function parseRepositoryErrorAndGetText(error: RepositoryError) {
  const reason = getTranslatedReason(error.reason);
  const noun = getTranslatedNoun(error.noun, error.plural);
  const verb = getTranslatedVerb(error.verb);

  if (reason) {
    return `${reason}: Failed to ${verb} ${noun}`;
  }
  return `Failed to ${verb} ${noun}`;
}

function getTranslatedReason(reason: ErrorReason): string | undefined {
  switch (reason) {
    case ErrorReason.NotFound:
      return "Not found";
    case ErrorReason.NotAuthorized:
      return "Not Authorized";
    case ErrorReason.Forbidden:
      return "Forbidden";
    case ErrorReason.BadRequest:
      return "Bad request";
    case ErrorReason.TimedOut:
      return "Timeout Reached";
    case ErrorReason.RateLimited:
      return "Rate limited";
    case ErrorReason.ServerError:
      return "Server Error";
    default:
      return undefined;
  }
}

function getTranslatedNoun(noun: ErrorNoun, plural: boolean): string {
  switch (noun) {
    case ErrorNoun.User:
      return plural ? "users" : "user";
    case ErrorNoun.UserInvites:
      return plural ? "invites" : "invite";
    case ErrorNoun.Dashboards:
      return plural ? "dashboards" : "dashboard";
    case ErrorNoun.Organizations:
      return plural ? "organizations" : "organization";
    case ErrorNoun.Meetings:
      return plural ? "meetings" : "meeting";
    case ErrorNoun.MeetingDocuments:
      return plural ? "documents" : "document";
    case ErrorNoun.MeetingLogs:
      return plural ? "logs" : "log";
    case ErrorNoun.NotificationSettings:
      return plural ? "notification settings" : "notification settings";
    case ErrorNoun.Notifications:
      return plural ? "notifications" : "notification";
    default:
      return "";
  }
}

function getTranslatedVerb(verb: ErrorVerb): string {
  switch (verb) {
    case ErrorVerb.Create:
      return "create";
    case ErrorVerb.Read:
      return "read";
    case ErrorVerb.Update:
      return "update";
    case ErrorVerb.Delete:
      return "delete";
    case ErrorVerb.Upload:
      return "upload";
    default:
      return "";
  }
}
