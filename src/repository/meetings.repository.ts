import { supabase } from "@/lib/supabase.lib";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase-generated.types";
import {
  ErrorNoun,
  ErrorVerb,
  getRepositoryError,
  RepositoryError,
} from "./_repositoryErrors";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createSubscription } from "./_subscriptionManager";

export type MeetingDTO = Tables<"meetings">;
export type InsertMeetingDTO = TablesInsert<"meetings">;
export type UpdateMeetingDTO = TablesUpdate<"meetings">;

export class MeetingsRepository {
  private static meetings = () => supabase.from("meetings");

  public static listenToMeetingsBefore(
    organizationIds: number[],
    date: Date,
    onMeetingChanges: (
      changedMeetings: MeetingDTO[],
      deletedMeetingIds: number[],
      replaceState: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    return this.listenToMeetings(
      organizationIds,
      date,
      true,
      onMeetingChanges,
      onError,
    );
  }

  public static listenToMeetingsAfter(
    organizationIds: number[],
    date: Date,
    onMeetingChanges: (
      changedMeetings: MeetingDTO[],
      deletedMeetingIds: number[],
      replaceState: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    return this.listenToMeetings(
      organizationIds,
      date,
      false,
      onMeetingChanges,
      onError,
    );
  }

  private static listenToMeetings(
    organizationIds: number[],
    date: Date,
    before: boolean,
    onMeetingChanges: (
      changedMeetings: MeetingDTO[],
      deletedMeetingIds: number[],
      replaceState: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    const doInitialLoad = () => {
      const query = this.meetings()
        .select()
        .in("organization_id", organizationIds);

      if (before) {
        query.lt("meeting_date", date.toISOString());
      } else {
        query.gte("meeting_date", date.toISOString());
      }

      query
        .order("meeting_date", { ascending: before })
        .then(({ data, error, status }) => {
          if (error) {
            console.error(error);
            onError(
              getRepositoryError(
                error,
                ErrorVerb.Read,
                ErrorNoun.Meetings,
                true,
                status,
              ),
            );
          } else {
            onMeetingChanges(data, [], true);
          }
        });
    };

    const handlePayload = (
      payload: RealtimePostgresChangesPayload<MeetingDTO>,
    ) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        if (before && new Date(payload.new.meeting_date) < date) {
          onMeetingChanges([payload.new], [], false);
        } else if (!before && new Date(payload.new.meeting_date) >= date) {
          onMeetingChanges([payload.new], [], false);
        }
      } else if (payload.eventType === "DELETE" && payload.old.id) {
        onMeetingChanges([], [payload.old.id], false);
      } else {
        onError(
          getRepositoryError(
            "Unknown event type",
            ErrorVerb.Read,
            ErrorNoun.Meetings,
            true,
          ),
        );
      }
    };

    return createSubscription(
      `meetings:organization_id=in.(${organizationIds.join(",")})`,
      "meetings",
      `organization_id=in.(${organizationIds.join(",")})`,
      doInitialLoad,
      handlePayload,
    );
  }

  public static listenToMeeting(
    meetingId: number,
    onMeetingChanges: (
      meeting: MeetingDTO | null,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    const doInitialLoad = () => {
      this.meetings().select().eq("id", meetingId).single()
        .then(({ data, error, status }) => {
          if (error) {
            console.error(error);
            onError(
              getRepositoryError(
                error,
                ErrorVerb.Read,
                ErrorNoun.Meetings,
                true,
                status,
              ),
            );
          } else {
            onMeetingChanges(data);
          }
        });
    };

    const handlePayload = (
      payload: RealtimePostgresChangesPayload<MeetingDTO>,
    ) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        onMeetingChanges(payload.new);
      } else if (payload.eventType === "DELETE" && payload.old.id) {
        onMeetingChanges(null);
      } else {
        onError(
          getRepositoryError(
            "Unknown event type",
            ErrorVerb.Read,
            ErrorNoun.Meetings,
            true,
          ),
        );
      }
    };

    return createSubscription(
      `meeting:meetingId=${meetingId}`,
      "meetings",
      `id=eq.${meetingId}`,
      doInitialLoad,
      handlePayload,
    );
  }

  public static createMeeting(meetingDTO: InsertMeetingDTO): Promise<number> {
    return new Promise((resolve, reject) => {
      this.meetings()
        .insert(meetingDTO)
        .select()
        .single()
        .then(({ data, error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Create,
                ErrorNoun.Meetings,
                false,
                status,
              ),
            );
          } else {
            resolve(data!.id);
          }
        });
    });
  }

  public static updateMeeting(
    meetingId: number,
    meetingDTO: UpdateMeetingDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.meetings()
        .update(meetingDTO)
        .eq("id", meetingId)
        .then(({ error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Update,
                ErrorNoun.Meetings,
                false,
                status,
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static deleteMeeting(meetingId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.meetings()
        .delete()
        .eq("id", meetingId)
        .then(({ error, status }) => {
          if (error) {
            console.error(error);
            reject(
              getRepositoryError(
                error,
                ErrorVerb.Delete,
                ErrorNoun.Meetings,
                false,
                status,
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }
}
