export interface DoctorPrivateDto {
    "id": string,
    "first_name": string,
    "second_name": string,
    "last_name": string,
    "specializations": string[],
    "specialization_detail": string,
    "working_experience": number,
  "gender": 'Жінка' | 'Чоловік',
    "type": string | null,
  "is_approved": true,
  "profile_status": string,
  "profile_progress": string,
  "created_at": string,
  "updated_at": string
}
