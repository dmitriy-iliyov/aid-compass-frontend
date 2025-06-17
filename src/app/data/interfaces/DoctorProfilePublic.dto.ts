import {DoctorPublicDto} from './DoctorPublic.dto';
import {ContactPublicDto} from './ContactPublic.dto';

export interface DoctorProfilePublicDto {
  "avatar_url": string | null,
  "doctor_profile": {
    "doctor": DoctorPublicDto,
    "detail": {
      "about_myself": string,
      "address": string
    }
  },
  "contacts": ContactPublicDto[],
  "appointment_duration": 30
}

