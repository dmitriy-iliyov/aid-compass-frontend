import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, pipe} from 'rxjs';
import {DoctorCardPublicDto} from '../interfaces/DoctorCardPublic.dto';
import {DoctorProfilePrivateDto} from '../interfaces/DoctorProfilePrivate.dto';
import {DoctorProfilePublicDto} from '../interfaces/DoctorProfilePublic.dto';
import {Jurist} from '../interfaces/Jurist.interface';
import {VolunteerDetailDto} from '../interfaces/VolunteerDetail.dto';
import {PageDto} from '../interfaces/Page.dto';
import {DoctorProfilePrivateAdminDto} from '../interfaces/DoctorProfilePrivateAdmin.dto';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class JuristsService {
  http = inject(HttpClient);
  baseApiUrl = `${environment.apiUrl}/aggregator/jurists`;
  basePrivateApiUrl= `${environment.apiUrl}/v1/jurists`;
  baseAdminApiUrl = `${environment.apiUrl}/admin/v1/jurists`;
  baseAdminGetApiUrl = `${environment.apiUrl}/admin/aggregator/jurists/unapproved`;

  constructor() { }

  getJurists(): Observable<PageDto<DoctorCardPublicDto>> {
    return this.http.get<PageDto<any>>(`${this.baseApiUrl}/cards?page=0&size=10`).pipe(
      map(response => {
        const adaptedPage = response.data
          .map(profile => this.adaptProfileCard(profile))
          .filter((card): card is DoctorCardPublicDto => card !== null);

        return {
          ...response,
          data: this.applyDefaultAvatars(adaptedPage)
        };
      })
    );
  }

  getJuristsUnapproved(page:number): Observable<PageDto<DoctorProfilePrivateAdminDto>> {
    return this.http.get<PageDto<any>>(`${this.baseAdminGetApiUrl}/cards?page=${page}&size=10`, {withCredentials:true}).pipe(
      map(response => {
        const adapted = response.data
          .map(profile => this.adaptJuristToDoctorProfilePrivateAdmin(profile))
          .filter((card): card is DoctorProfilePrivateAdminDto => card !== null);

        return {
          ...response,
          data: this.applyDefaultAvatarsPrivateProfileListAdmin(adapted)
        };
      })
    );
  }

  getUnapprovedJuristsByName(str:string, page:number):Observable<PageDto<DoctorProfilePrivateAdminDto>> {
    if (str == '')
      return this.getJuristsUnapproved(page);
    return this.http.get<PageDto<any>>(`${this.baseAdminGetApiUrl}/cards/names?last_name=${str}&page=${page}&size=10`, {withCredentials:true})
      .pipe(
        map(response => {
          const adapted = response.data
            .map(profile => this.adaptJuristToDoctorProfilePrivateAdmin(profile))
            .filter((card): card is DoctorProfilePrivateAdminDto => card !== null);

          return {
            ...response,
            data: this.applyDefaultAvatarsPrivateProfileListAdmin(adapted)
          };
        })
      );
  }

  approveJurist(id: string | undefined) {
    return this.http.patch(`${this.baseAdminApiUrl}/approve/${id}`, null, {withCredentials:true})
  }

  getJuristsByFilter(type: string, specialization: string, page:number): Observable<PageDto<DoctorCardPublicDto>> {
    let query = '';

    if (type) {
      query += `type=${type}&`;
    }
    if (specialization) {
      query += `specialization=${specialization}&`;
    }

    const url = query
      ? `${this.baseApiUrl}/cards/filter?${query}page=${page}&size=10`
      : `${this.baseApiUrl}/cards?page=${page}&size=10`;

    return this.http.get<PageDto<any>>(url).pipe(
      map(response => {
        const adapted = response.data
          .map(profile => this.adaptProfileCard(profile))
          .filter((card): card is DoctorCardPublicDto => card !== null);

        return {
          ...response,
          data: this.applyDefaultAvatars(adapted)
        };
      })
    );
  }

  getJuristsByName(str: string, type: string, page:number): Observable<PageDto<DoctorCardPublicDto>> {
    if (str === '') return this.getJurists();
    if (type!=='')
      type='&type='+type

    return this.http.get<PageDto<any>>(`${this.baseApiUrl}/cards/names?last_name=${str}&page=${page}&size=10${type}`).pipe(
      map(response => {
        const adapted = response.data
          .map(profile => this.adaptProfileCard(profile))
          .filter((card): card is DoctorCardPublicDto => card !== null);

        return {
          ...response,
          data: this.applyDefaultAvatars(adapted)
        };
      })
    );
  }

  getPrivateProfile(): Observable<DoctorProfilePrivateDto> {
    return this.http.get<DoctorProfilePrivateDto>(`${this.baseApiUrl}/me/profile`, {withCredentials :true})
      .pipe(
        map(profile => this.adaptJuristToDoctorProfilePrivate(profile)),
        map(profile => this.applyDefaultAvatarToPrivateProfile(profile))
      );
  }

  getPublicProfile(doctorId: string): Observable<DoctorProfilePublicDto> {
    return this.http.get<DoctorProfilePublicDto>(`${this.baseApiUrl}/${doctorId}/profile`)
      .pipe(
        map(profile => this.adaptJuristToDoctorProfilePublic(profile)),
        map(profile => this.applyDefaultAvatarToPublicProfile(profile))
      );
  }

  private adaptProfileCard(profile: any): DoctorCardPublicDto | null {
    if (profile.doctor) {
      return {
        avatar_url: profile.avatar_url ?? null,
        doctor: profile.doctor,
        nearest_interval: profile.nearest_interval,
        appointment_duration: profile.appointment_duration,
      };
    }

    if (profile.jurist) {
      const jurist = profile.jurist;

      const adaptedDoctor = {
        id: jurist.id,
        first_name: jurist.first_name,
        second_name: jurist.second_name,
        last_name: jurist.last_name,
        specializations: jurist.specializations,
        specialization_detail: jurist.specialization_detail,
        working_experience: jurist.working_experience,
        gender: jurist.gender,
        type: jurist.type
      };

      return {
        avatar_url: profile.avatar_url ?? null,
        doctor: adaptedDoctor,
        nearest_interval: profile.nearest_interval,
        appointment_duration: profile.appointment_duration,
      };
    }
    return null;
  }

  adaptJuristToDoctorProfilePrivate(profile: any): DoctorProfilePrivateDto {
    return {
      avatar_url: profile.avatar_url ?? null,
      doctor_profile: {
        doctor: {
          id: profile.jurist_profile.jurist.id,
          first_name: profile.jurist_profile.jurist.first_name,
          second_name: profile.jurist_profile.jurist.second_name,
          last_name: profile.jurist_profile.jurist.last_name,
          specializations: profile.jurist_profile.jurist.specializations,
          specialization_detail: profile.jurist_profile.jurist.specialization_detail,
          working_experience: profile.jurist_profile.jurist.working_experience,
          gender: profile.jurist_profile.jurist.gender,
          is_approved: profile.jurist_profile.jurist.is_approved,
          profile_status: profile.jurist_profile.jurist.profile_status,
          type: profile.jurist_profile.jurist.type,
          profile_progress: profile.jurist_profile.jurist.profile_progress,
          created_at: profile.jurist_profile.jurist.created_at,
          updated_at: profile.jurist_profile.jurist.updated_at
        },
        detail: {
          about_myself: profile.jurist_profile.detail.about_myself,
          address: profile.jurist_profile.detail.address
        }
      },
      contacts: profile.contacts,
      appointment_duration: profile.appointment_duration
    };
  }

  adaptJuristToDoctorProfilePrivateAdmin(profile: any): DoctorProfilePrivateAdminDto {
    return {
      avatar_url: profile.avatar_url ?? null,
      doctor_profile: {
        doctor: {
          id: profile.jurist_profile.jurist.id,
          first_name: profile.jurist_profile.jurist.first_name,
          second_name: profile.jurist_profile.jurist.second_name,
          last_name: profile.jurist_profile.jurist.last_name,
          specializations: profile.jurist_profile.jurist.specializations,
          specialization_detail: profile.jurist_profile.jurist.specialization_detail,
          working_experience: profile.jurist_profile.jurist.working_experience,
          gender: profile.jurist_profile.jurist.gender,
          is_approved: profile.jurist_profile.jurist.is_approved,
          profile_status: profile.jurist_profile.jurist.profile_status,
          type: profile.jurist_profile.jurist.type,
          profile_progress: profile.jurist_profile.jurist.profile_progress,
          created_at: profile.jurist_profile.jurist.created_at,
          updated_at: profile.jurist_profile.jurist.updated_at
        },
        detail: {
          id: profile.jurist_profile.detail.id,
          about_myself: profile.jurist_profile.detail.about_myself,
          address: profile.jurist_profile.detail.address
        }
      },
      contacts: profile.contacts,
      appointment_duration: profile.appointment_duration
    };
  }

  adaptJuristToDoctorProfilePublic(profile: any): DoctorProfilePublicDto {
    return {
      avatar_url: profile.avatar_url ?? null,
      doctor_profile: {
        doctor: {
          id: profile.jurist_profile.jurist.id,
          first_name: profile.jurist_profile.jurist.first_name,
          second_name: profile.jurist_profile.jurist.second_name,
          last_name: profile.jurist_profile.jurist.last_name,
          specializations: profile.jurist_profile.jurist.specializations,
          specialization_detail: profile.jurist_profile.jurist.specialization_detail,
          working_experience: profile.jurist_profile.jurist.working_experience,
          gender: profile.jurist_profile.jurist.gender,
          type:profile.jurist_profile.jurist.type
        },
        detail: {
          about_myself: profile.jurist_profile.detail.about_myself,
          address: profile.jurist_profile.detail.address
        }
      },
      contacts: profile.contacts,
      appointment_duration: profile.appointment_duration
    };
  }


applyDefaultAvatars(cards: DoctorCardPublicDto[]): DoctorCardPublicDto[] {
    return cards.map(card => {
      if (!card.avatar_url) {
        const gender = card.doctor.gender;
        let defaultAvatar = '/assets/images/default-user.png';

        if (gender === 'Жінка') {
          defaultAvatar = '/assets/images/lawyer-w2.png';
        } else if (gender === 'Чоловік') {
          defaultAvatar = '/assets/images/lawyer-m2.png';
        }

        return {
          ...card,
          avatar_url: defaultAvatar
        };
      }
      return card;
    });
  }

  applyDefaultAvatarsPrivateProfileListAdmin(profiles: DoctorProfilePrivateAdminDto[]): DoctorProfilePrivateAdminDto[] {
    return profiles.map(profile => {
      if (!profile.avatar_url) {
        const gender = profile.doctor_profile.doctor.gender;
        let defaultAvatar = '/assets/images/default-user.png';

        if (gender === 'Жінка') {
          defaultAvatar = '/assets/images/lawyer-w2.png';
        } else if (gender === 'Чоловік') {
          defaultAvatar = '/assets/images/lawyer-m2.png';
        }

        return {
          ...profile,
          avatar_url: defaultAvatar
        };
      }
      return profile;
    });
  }

  applyDefaultAvatarToPrivateProfile(profile: DoctorProfilePrivateDto): DoctorProfilePrivateDto {
    if (!profile.avatar_url) {
      const gender = profile.doctor_profile.doctor.gender;
      let defaultAvatar = '/assets/images/default-user.png';

      if (gender === 'Жінка') {
        defaultAvatar = '/assets/images/lawyer-w2.png';
      } else if (gender === 'Чоловік') {
        defaultAvatar = '/assets/images/lawyer-m2.png';
      }

      return {
        ...profile,
        avatar_url: defaultAvatar
      };
    }

    return profile;
  }

  applyDefaultAvatarToPublicProfile(profile: DoctorProfilePublicDto): DoctorProfilePublicDto {
    if (!profile.avatar_url) {
      const gender = profile.doctor_profile.doctor.gender;
      let defaultAvatar = '/assets/images/default-user.png';
      
      if (gender === 'Жінка') {
        defaultAvatar = '/assets/images/lawyer-w2.png';
      } else if (gender === 'Чоловік') {
        defaultAvatar = '/assets/images/lawyer-m2.png';
      }

      return {
        ...profile,
        avatar_url: defaultAvatar
      };
    }

    return profile;
  }
  update(data: any): Observable<any> {
    const prepared_json = {
      last_name: data.lastName,
      first_name: data.firstName,
      second_name: data.secondName,
      specializations: [data.specializations],
      specialization_detail: data.specialization_detail,
      working_experience: data.experience,
      gender: data.GENDER,
      type: data.type
    };
    return this.http.patch<Jurist>(`${this.basePrivateApiUrl}/me`, prepared_json, {withCredentials:true})
  }
  updateAdditional(data: any): Observable<VolunteerDetailDto> {
    const prepared_json = {
      address: data.address,
      about_myself: data.about_myself,
    };
    return this.http.patch<VolunteerDetailDto>(`${this.basePrivateApiUrl}/me/detail`, prepared_json, {withCredentials:true})
  }
  create(data: any): Observable<any> {
    const prepared_json = {
      last_name: data.lastName,
      first_name: data.firstName,
      second_name: data.secondName,
      specializations: [data.specializations],
      specialization_detail: data.specialization_detail,
      working_experience: data.experience,
      gender: data.GENDER,
      type: data.type
    };
    return this.http.post<Jurist>(`${this.basePrivateApiUrl}`, prepared_json, {withCredentials:true})
  }
}
