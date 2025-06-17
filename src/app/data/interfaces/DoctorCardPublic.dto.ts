import {DoctorPublicDto} from './DoctorPublic.dto';

export interface DoctorCardPublicDto {
  "avatar_url": string | null,
  "doctor": DoctorPublicDto,
  "nearest_interval": {
    "id": number,
    "owner_id": string,
    "start": string,
    "date": string,
    "day": {
      "full_name": string,
      "short_name": string
    }
  },
  "appointment_duration": string | null
}
