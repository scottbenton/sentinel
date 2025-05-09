import { RepositoryError } from "@/repository/_repositoryErrors";
import {
  MeetingDTO,
  MeetingsRepository,
} from "@/repository/meetings.repository";
import { LogsService, LogTypes } from "./logs.service";

export interface IMeeting {
  id: number;
  organizationId: number;
  name: string;
  meetingDate: Date;
  createdAt: Date;
  createdBy: string | null;
}

export class MeetingsService {
  public static listenToFutureMeetings(
    organizationIds: number[],
    onMeetingChanges: (
      changedMeetings: IMeeting[],
      deletedMeetingIds: number[],
      replaceState: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    // Get the current day at midnight utc
    const currentDate = new Date(
      new Date(new Date().toLocaleDateString()).toISOString().split("T")[0] +
        "T00:00:00.000Z",
    );

    // Get meetings after the current date
    return MeetingsRepository.listenToMeetingsAfter(
      organizationIds,
      currentDate,
      (
        changedMeetings: MeetingDTO[],
        deletedMeetingIds: number[],
        replaceState: boolean,
      ) => {
        const meetings = changedMeetings.map((meetingDTO) =>
          this.convertMeetingDTOToMeeting(meetingDTO)
        );
        onMeetingChanges(meetings, deletedMeetingIds, replaceState);
      },
      onError,
    );
  }

  public static listenToPastMeetings(
    organizationIds: number[],
    onMeetingChanges: (
      changedMeetings: IMeeting[],
      deletedMeetingIds: number[],
      replaceState: boolean,
    ) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    // Get the current day at midnight utc
    const currentDate = new Date(
      new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
    );
    // Get meetings after the current date

    return MeetingsRepository.listenToMeetingsBefore(
      organizationIds,
      currentDate,
      (
        changedMeetings: MeetingDTO[],
        deletedMeetingIds: number[],
        replaceState: boolean,
      ) => {
        const meetings = changedMeetings.map((meetingDTO) =>
          this.convertMeetingDTOToMeeting(meetingDTO)
        );
        onMeetingChanges(meetings, deletedMeetingIds, replaceState);
      },
      onError,
    );
  }

  public static listenToMeeting(
    meetingId: number,
    onMeetingChange: (meeting: IMeeting | null) => void,
    onError: (error: RepositoryError) => void,
  ): () => void {
    return MeetingsRepository.listenToMeeting(
      meetingId,
      (meetingDTO) => {
        if (meetingDTO) {
          onMeetingChange(this.convertMeetingDTOToMeeting(meetingDTO));
        } else {
          onMeetingChange(null);
        }
      },
      onError,
    );
  }

  public static async createMeeting(
    uid: string,
    organizationId: number,
    meetingName: string,
    meetingDate: Date,
  ): Promise<number> {
    const meetingId = await MeetingsRepository.createMeeting({
      organization_id: organizationId,
      name: meetingName,
      meeting_date: meetingDate.toISOString(),
      created_by: uid,
    });

    try {
      LogsService.createLog({
        uid,
        meetingId,
        organizationId: null,
        type: LogTypes.MeetingCreated,
      });
    } catch (error) {
      console.error(error);
    }

    return meetingId;
  }

  public static updateMeeting(
    uid: string,
    meetingId: number,
    previousMeetingName: string,
    meetingName: string,
    previousMeetingDate: Date,
    meetingDate: Date,
  ): Promise<void> {
    try {
      if (previousMeetingName !== meetingName) {
        LogsService.createLog({
          uid,
          meetingId,
          organizationId: null,
          type: LogTypes.MeetingNameChanged,
          additionalContext: {
            previous_name: previousMeetingName,
            new_name: meetingName,
          },
        });
      }

      const getMeetingDate = (date: Date) =>
        date.toLocaleDateString("en-US", { timeZone: "UTC" });

      if (getMeetingDate(previousMeetingDate) !== getMeetingDate(meetingDate)) {
        LogsService.createLog({
          uid,
          meetingId,
          organizationId: null,
          type: LogTypes.MeetingDateChanged,
          additionalContext: {
            previous_date: previousMeetingDate.toISOString(),
            new_date: meetingDate.toISOString(),
          },
        });
      }
    } catch (error) {
      console.error(error);
    }

    return MeetingsRepository.updateMeeting(meetingId, {
      name: meetingName,
      meeting_date: meetingDate.toISOString(),
    });
  }

  public static deleteMeeting(meetingId: number): Promise<void> {
    return MeetingsRepository.deleteMeeting(meetingId);
  }

  private static convertMeetingDTOToMeeting(meetingDTO: MeetingDTO): IMeeting {
    return {
      id: meetingDTO.id,
      organizationId: meetingDTO.organization_id,
      name: meetingDTO.name,
      meetingDate: new Date(meetingDTO.meeting_date),
      createdAt: new Date(meetingDTO.created_at),
      createdBy: meetingDTO.created_by,
    };
  }
}
