import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {DoctorCardPublicDto} from '../interfaces/DoctorCardPublic.dto';
import {DoctorProfilePublicDto} from '../interfaces/DoctorProfilePublic.dto';
import {VolunteerDetailDto} from '../interfaces/VolunteerDetail.dto';
import {DoctorProfilePrivateDto} from '../interfaces/DoctorProfilePrivate.dto';
import {PageDto} from '../interfaces/Page.dto';
import {DoctorProfilePrivateAdminDto} from '../interfaces/DoctorProfilePrivateAdmin.dto';


@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  http = inject(HttpClient);
  baseApiUrl = 'https://localhost:8443/api/aggregator/doctors';
  basePrivateApiUrl = 'https://localhost:8443/api/v1/doctors';
  baseAdminApiUrl = 'https://localhost:8443/api/admin/v1/doctors';
  baseAdminGetApiUrl = 'https://localhost:8443/api/admin/aggregator/doctors/unapproved';

  constructor() { }

  getDoctors(page:number): Observable<PageDto<DoctorCardPublicDto>> {
    return this.http.get<PageDto<DoctorCardPublicDto>>(`${this.baseApiUrl}/cards?page=${page}&size=10`)
      .pipe(
        map(response => ({
          ...response,
          data: this.applyDefaultAvatars(response.data)
        }))
      );
  }
  getDoctorsUnapproved(page:number): Observable<PageDto<DoctorProfilePrivateAdminDto>> {
    return this.http.get<PageDto<DoctorProfilePrivateAdminDto>>(`${this.baseAdminGetApiUrl}/cards?page=${page}&size=10`, {withCredentials:true})
      .pipe(
        map(response => ({
          ...response,
          data: this.applyDefaultAvatarsProfilePrivateAdmin(response.data)
        }))
      );
  }

  getUnapprovedDoctorsByName(str:string, page:number):Observable<PageDto<DoctorProfilePrivateAdminDto>> {
    if (str == '')
      return this.getDoctorsUnapproved(page);
    return this.http.get<PageDto<DoctorProfilePrivateAdminDto>>(`${this.baseAdminGetApiUrl}/cards/names?last_name=${str}&page=${page}`, {withCredentials:true})
      .pipe(
        map(response => ({
          ...response,
          data: this.applyDefaultAvatarsProfilePrivateAdmin(response.data)
        }))
      );
  }

  approveDoctor(id: string | undefined) {
    return this.http.patch(`${this.baseAdminApiUrl}/approve/${id}`, null, {withCredentials:true})
  }
  getDoctorsBySpecialization(str:string, page:number):Observable<PageDto<DoctorCardPublicDto>> {
    if (str == '100' || str == '')
      return this.getDoctors(page);
    return this.http.get<PageDto<DoctorCardPublicDto>>(`${this.baseApiUrl}/cards/${str}?page=${page}&size=10`)
      .pipe(
        map(response => ({
          ...response,
          data: this.applyDefaultAvatars(response.data)
        }))
      );
  }
  getDoctorsByName(str:string, page:number):Observable<PageDto<DoctorCardPublicDto>> {
    if (str == '')
      return this.getDoctors(page);
    return this.http.get<PageDto<DoctorCardPublicDto>>(`${this.baseApiUrl}/cards/names?last_name=${str}&page=${page}`)
      .pipe(
        map(response => ({
          ...response,
          data: this.applyDefaultAvatars(response.data)
        }))
      );
  }

  getPrivatProfile(): Observable<DoctorProfilePrivateDto> {
    return this.http.get<DoctorProfilePrivateDto>(`${this.baseApiUrl}/me/profile`, {withCredentials:true})
      .pipe(
        map(profile => this.applyDefaultAvatarToProfile(profile))
      );
  }

  getPublicProfile(doctorId:string): Observable<DoctorProfilePublicDto> {
    return this.http.get<DoctorProfilePublicDto>(`${this.baseApiUrl}/${doctorId}/profile`)
      .pipe(
        map(profile => this.applyDefaultAvatarToProfile(profile))
      );
  }

  update(data: any): Observable<DoctorProfilePrivateDto> {
    const prepared_json = {
      last_name: data.lastName,
      first_name: data.firstName,
      second_name: data.secondName,
      specializations: [data.specializations],
      specialization_detail: data.specialization_detail,
      working_experience: data.experience,
      gender: data.GENDER
    };
    return this.http.patch<DoctorProfilePrivateDto>(`${this.basePrivateApiUrl}/me`, prepared_json, {withCredentials:true})
  }
  updateAdditional(data: any): Observable<VolunteerDetailDto> {
    const prepared_json = {
      address: data.address,
      about_myself: data.about_myself,
    };
    return this.http.patch<VolunteerDetailDto>(`${this.basePrivateApiUrl}/me/detail`, prepared_json, {withCredentials:true})
  }

  create(data: any): Observable<DoctorProfilePublicDto> {
    const prepared_json = {
      last_name: data.lastName,
      first_name: data.firstName,
      second_name: data.secondName,
      specializations: [data.specializations],
      specialization_detail: data.specialization_detail,
      working_experience: data.experience,
      gender: data.GENDER
    };
    return this.http.post<DoctorProfilePublicDto>(`${this.basePrivateApiUrl}`, prepared_json, {withCredentials:true})
  }

  applyDefaultAvatars(cards: DoctorCardPublicDto[]): DoctorCardPublicDto[] {
    return cards.map(card => {
      console.log(card.avatar_url);

      if (!card.avatar_url) {
        const gender = card.doctor.gender;
        let defaultAvatar = '/assets/images/default-user.png';

        if (gender === 'Жінка') {
          defaultAvatar = '/assets/images/doctor-w2.png';
        } else if (gender === 'Чоловік') {
          defaultAvatar = '/assets/images/doctor-m2.png';
        }

        return {
          ...card,
          avatar_url: defaultAvatar
        };
        // return {
        //   ...card,
        //   doctor: {
        //     ...card.doctor,
        //     avatar_url: defaultAvatar
        //   }
        // };

      }

      return card;
    });
  }

  applyDefaultAvatarsProfilePrivate(profiles: DoctorProfilePrivateDto[]): DoctorProfilePrivateDto[] {
    return profiles.map(profile => {
      if (!profile.avatar_url) {
        const gender = profile.doctor_profile.doctor.gender;
        let defaultAvatar = '/assets/images/default-user.png';

        if (gender === 'Жінка') {
          defaultAvatar = '/assets/images/doctor-w2.png';
        } else if (gender === 'Чоловік') {
          defaultAvatar = '/assets/images/doctor-m2.png';
        }

        return {
          ...profile,
          avatar_url: defaultAvatar
        };
        // return {
        //   ...card,
        //   doctor: {
        //     ...card.doctor,
        //     avatar_url: defaultAvatar
        //   }
        // };

      }

      return profile;
    });
  }

  applyDefaultAvatarsProfilePrivateAdmin(profiles: DoctorProfilePrivateAdminDto[]): DoctorProfilePrivateAdminDto[] {
    return profiles.map(profile => {
      if (!profile.avatar_url) {
        const gender = profile.doctor_profile.doctor.gender;
        let defaultAvatar = '/assets/images/default-user.png';

        if (gender === 'Жінка') {
          defaultAvatar = '/assets/images/doctor-w2.png';
        } else if (gender === 'Чоловік') {
          defaultAvatar = '/assets/images/doctor-m2.png';
        }

        return {
          ...profile,
          avatar_url: defaultAvatar
        };
        // return {
        //   ...card,
        //   doctor: {
        //     ...card.doctor,
        //     avatar_url: defaultAvatar
        //   }
        // };

      }

      return profile;
    });
  }


  applyDefaultAvatarToProfile<T extends { avatar_url: string | null, doctor_profile: { doctor: {gender: string} } }>(profile: T): T {
    if (!profile.avatar_url) {
      const gender = profile.doctor_profile.doctor.gender;
      let defaultAvatar = '/assets/images/default-user.png';

      if (gender === 'Жінка') {
        defaultAvatar = '/assets/images/doctor-w2.png';
      } else if (gender === 'Чоловік') {
         defaultAvatar = '/assets/images/doctor-m2.png';
      }

      return {
        ...profile,
        avatar_url: defaultAvatar
      };

      // return {
      //   ...profile,
      //   doctor_profile: {
      //     ...card.doctor,
      //     avatar_url: defaultAvatar
      //   }
      // };
    }

    return profile;
  }
}
