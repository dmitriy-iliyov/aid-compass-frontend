export interface DoctorPublicDto {
    "id": string,
    "first_name": string,
    "second_name": string,
    "last_name": string,
    "specializations": string[],
    "specialization_detail": string,
    "working_experience": number,
  "gender": 'Жінка' | 'Чоловік',
  "type": string | null
}
