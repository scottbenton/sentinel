import { RepositoryError } from "@/repository/_repositoryErrors";
import {
  MeetingDTO,
  MeetingsRepository,
} from "@/repository/meetings.repository";

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
      new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
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
          this.convertMeetingDTOToMeeting(meetingDTO),
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
          this.convertMeetingDTOToMeeting(meetingDTO),
        );
        onMeetingChanges(meetings, deletedMeetingIds, replaceState);
      },
      onError,
    );
  }

  public static createMeeting(
    uid: string,
    organizationId: number,
    meetingName: string,
    meetingDate: Date,
  ): Promise<number> {
    return MeetingsRepository.createMeeting({
      organization_id: organizationId,
      name: meetingName,
      meeting_date: meetingDate.toISOString(),
      created_by: uid,
    });
  }

  public static updateMeeting(
    meetingId: number,
    meetingName: string,
    meetingDate: Date,
  ): Promise<void> {
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
