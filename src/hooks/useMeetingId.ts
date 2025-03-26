import { useParams } from "wouter";

export function useMeetingId() {
    const meetingId = useParams<{ meetingId: string }>().meetingId;
    if (!meetingId) {
        throw new Error("Meeting ID not found in URL");
    }
    const parsedMeetingId = parseInt(meetingId);
    if (isNaN(parsedMeetingId)) {
        throw new Error("Invalid meeting ID");
    }

    return parsedMeetingId;
}
