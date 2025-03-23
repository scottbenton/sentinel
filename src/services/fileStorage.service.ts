import { storage } from "@/lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";

export class FileStorageService {
  private static getAgendaFileRef(orgId: string, filename: string) {
    return ref(storage, `agendas/${orgId}/${filename}`);
  }
  public static getOrganizationMeetingAgenda(
    orgId: string,
    filename: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileRef = this.getAgendaFileRef(orgId, filename);
      getDownloadURL(fileRef)
        .then((url) => resolve(url))
        .catch((e) => reject(e));
    });
  }
}
