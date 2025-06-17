export interface ContactPublicDto {
  "type": 'EMAIL' | 'PHONE_NUMBER',
  "contact": string,
  "isPrimary": boolean
}
