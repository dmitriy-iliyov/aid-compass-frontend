export interface ContactPrivateDto {
  "id": number
  "type": 'EMAIL' | 'PHONE_NUMBER',
  "contact": string,
  "is_primary": boolean
  "is_confirmed": boolean
}
