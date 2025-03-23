import {
  MeetingDTO,
  MeetingsRepository,
} from "@/repository/meetings.repository";
import { IMeeting } from "@/types/Meeting.type";

export class MeetingsService {
  public static async getFutureMeetings(orgId: string): Promise<IMeeting[]> {
    const meetings =
      await MeetingsRepository.getUpcomingMeetingsForOrganization(orgId);
    return meetings.docs.map((meeting) => {
      const meetingData = meeting.data();
      return this.convertMeetingDTOToMeeting(meeting.id, meetingData);
    });
  }

  private static convertMeetingDTOToMeeting(
    meetingId: string,
    meetingDTO: MeetingDTO
  ): IMeeting {
    return {
      ...meetingDTO,
      id: meetingId,
      meetingDate: meetingDTO.meetingDate.toDate(),
      uploadedOn: meetingDTO.uploadedOn.toDate(),
    };
  }
}
