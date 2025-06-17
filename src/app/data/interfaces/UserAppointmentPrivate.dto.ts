export interface UserAppointmentPrivateDto {
  appointment: {
    id: number;
    customer_id: string;
    volunteer_id: string;
    date: string;
    start: string;
    end: string;
    type: 'ONLINE' | 'OFFLINE';
    status: string,
    description: string;
  };
  avatar_url: string;
  volunteer: {
    id: string;
    first_name: string;
    second_name: string;
    last_name: string;
    specializations: string[] | null;
    specialization_detail?: string;
    working_experience?: number;
    "gender": 'Жінка' | 'Чоловік',
  };
}
