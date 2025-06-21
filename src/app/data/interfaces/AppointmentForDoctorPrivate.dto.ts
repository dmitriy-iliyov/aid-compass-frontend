import {ContactPublicDto} from './ContactPublic.dto';

export interface AppointmentForDoctorPrivateDto {
  "appointment": {
    "id": number,
    "customer_id": string,
    "volunteer_id": string,
    "date": string,
    "start": string,
    "end": string,
    "type": string,
    "status": string,
    "topic": string,
    "description": string
  },
  "avatar_url": string,
  "customer": {
    "id": string,
    "last_name": string,
    "first_name": string,
    "second_name": string,
    "birthday_date": string,
    "gender": 'Жінка' | 'Чоловік',
  },
  "contacts": ContactPublicDto[],
}
