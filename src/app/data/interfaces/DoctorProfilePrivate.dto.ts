import {DoctorPrivateDto} from './DoctorPrivate.dto';
import {ContactPrivateDto} from './ContactPrivate.dto';

export interface DoctorProfilePrivateDto {
  "avatar_url": string | null,
  "doctor_profile": {
    "doctor": DoctorPrivateDto ,
    "detail": {
      "about_myself": string,
      "address": string
    }
  },
  "contacts": ContactPrivateDto[],
  "appointment_duration": number
}
