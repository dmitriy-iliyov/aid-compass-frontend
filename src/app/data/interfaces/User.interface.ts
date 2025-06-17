import {ContactPrivateDto} from './ContactPrivate.dto';

export interface User {
  "avatar_url": null,
  "customer_profile": {
    "id": "01974195-93ec-75b6-b696-e2dbafddf25a",
    "last_name": "Петренко",
    "first_name": "Олена",
    "second_name": "Ігорівна",
    "birthday_date": "2025-06-05",
    "gender": "FEMALE",
    "profile_status": "COMPLETE"
  },
  "contacts": ContactPrivateDto[],

}
