import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DoctorsService} from '../../data/services/doctors.service';
import {InfoService} from '../../data/services/info.service';
import {AvatarService} from '../../data/services/avatar.service';
import {ContactService} from '../../data/services/contacts.service';
import {JuristsService} from '../../data/services/jurists.service';
import {RoleService} from '../../data/services/role.service';
import {CoreUsersService} from '../../data/services/core-users.service';
import {AppointmentService} from '../../data/services/appointment.service';
import {DoctorProfilePrivateDto} from '../../data/interfaces/DoctorProfilePrivate.dto';

@Component({
  selector: 'app-volunteer-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './volunteer-edit-page.component.html',
  styleUrl: './volunteer-edit-page.component.scss'
})
export class VolunteerEditPageComponent {
  constructor(
    private router: Router,
    private doctorsService: DoctorsService,
    private infoService: InfoService,
    private avatarService: AvatarService,
    private contactService: ContactService,
    private doctorService: DoctorsService,
    private juristService: JuristsService,
    protected roleService: RoleService,
    private coreUserService: CoreUsersService,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,

  ) {}
  objectKeys = Object.keys;

  cfErrorMessages: { [key: string]: string } = {};
  pfErrorMessages: { [key: string]: string } = {};
  afErrorMessages: string | null  = null;

  formData = {
    id: '',
    firstName: '',
    lastName : '',
    secondName: '',
    GENDER:'',
    specializations: '',
    experience: 0,
    specialization_detail: '',
    avatar: '',
    contact:'',
    phoneId: null as number | null,
    phonePrimary: true,
    email: '',
    emailId: null as number | null,
    emailPrimary: true,
    appointmentDuration: '30',
    type: null as string | null,
    about_myself: '',
    address: ''
  };

  doctorId: string | null | undefined;
  doctor: DoctorProfilePrivateDto = {} as DoctorProfilePrivateDto;
  specializationsList: string[] =[];
  typesList: string[] =[];

  submittedPersonal = false;
  submittedContact = false;
  submittedAdditional = false;

  avatarFile: File | null = null;
  avatarPreview: string | ArrayBuffer | null = '/assets/images/default-user.png';

  role:string | null = null;
  title = 'Створення профілю волонтера';
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe
    (params => {
      this.role = params['role'];
    });

    if (this.roleService.isDoctor() || (this.roleService.isUser() && this.role === 'DOCTOR')) {
      this.title = 'Редагування профілю волонтера';
      this.ngOnInitDoctor();
    } else if (this.roleService.isJurist() || (this.roleService.isUser() && this.role === 'JURIST')) {
      this.title = 'Редагування профілю волонтера';
      this.ngOnInitJurist();
    }
  }

  isLoading: boolean = true;
  status: string = 'Завантаження ...';
  ngOnInitDoctor() {
    this.infoService.getDoctorSpecialisations().subscribe
    ({
      next:(res)=>{
        this.specializationsList = res
        console.log(this.specializationsList)

        if (this.roleService.isDoctor()) {
          this.doctorsService.getPrivatProfile().subscribe
          ({
            next:(profile)=>{



              this.doctor = profile;
              this.avatarPreview = this.doctor.avatar_url
              console.log(this.doctor);

              const phoneContact = this.doctor.contacts.find(c =>
                c.type === 'PHONE_NUMBER'
              );
              const emailContact = this.doctor.contacts.find(c =>
                c.type === 'EMAIL' && (c.is_primary || c.is_primary)
              );

              this.formData ={
                id: this.doctor?.doctor_profile.doctor.id ,
                firstName: this.doctor?.doctor_profile.doctor.first_name,
                lastName : this.doctor?.doctor_profile.doctor.last_name,
                secondName: this.doctor?.doctor_profile.doctor.second_name,
                GENDER:this.doctor?.doctor_profile.doctor.gender,
                specializations: this.doctor?.doctor_profile.doctor.specializations[0],
                experience: Number(this.doctor?.doctor_profile?.doctor?.working_experience),
                specialization_detail: this.doctor?.doctor_profile.doctor.specialization_detail,
                avatar: this.doctor?.avatar_url ??'',
                contact: phoneContact?.contact || '',
                phoneId: phoneContact?.id ?? null,
                phonePrimary: phoneContact?.is_primary ?? true,
                email: emailContact?.contact || '',
                emailId: emailContact?.id ?? null,
                emailPrimary: emailContact?.is_primary ?? true,
                appointmentDuration: '30',
                type: '',
                about_myself: this.doctor.doctor_profile.detail.about_myself,
                address: this.doctor.doctor_profile.detail.address
              };

              this.appointmentService.getAppointmentDurationPrivate().subscribe
              ({
                next:(data)=>{
                  this.formData.appointmentDuration = String(data);
                  this.isLoading = false;
                },
                error:(err)=>{
                  this.status = 'Помилка при трівалості консультаціі:'+ String(err)
                  console.error('Помилка при трівалості консультаціі::', err);
                }});

            },
            error:(err)=>{
              this.status = 'Помилка при профіля лікаря:'+ String(err)
              console.error('Помилка при профіля лікаря:', err);
            }});



        } else {
          this.coreUserService.get().subscribe
          ({
            next:(res)=>{
              console.log('email='+res)
              this.formData.email = res.email;
              this.isLoading = false;
            },
            error:(err)=>{
              this.status = 'Помилка при отриманні email:'+ String(err)
              console.error('Помилка при отриманні email:', err);
            }});

        }





      },
      error:(err)=>{
        this.status = 'Помилка при отриманні спеціалізацій лікаря:'+ String(err)
        console.error('Помилка при отриманні спеціалізацій лікаря:', err);
      }});





  }
  ngOnInitJurist() {
    this.infoService.getJuristSpecialisations().subscribe
    ({
      next:(res)=>{
        this.specializationsList = res
        console.log(this.specializationsList)
        this.infoService.getJuristTypes().subscribe
        ({
          next:(res)=>{
            this.typesList = res
            console.log(this.typesList)

            if (this.roleService.isJurist()) {
              this.juristService.getPrivateProfile().subscribe
              ({
                next:(profile)=>{






                  this.doctor = profile;
                  console.log(this.doctor)

                  this.avatarPreview = this.doctor.avatar_url

                  //this.experience = Number(this.doctor?.doctor_profile?.doctor?.working_experience);
                  console.log(this.doctor);

                  const phoneContact = this.doctor.contacts.find(c =>
                    c.type === 'PHONE_NUMBER'
                  );

                  const emailContact = this.doctor.contacts.find(c =>
                    c.type === 'EMAIL' && (c.is_primary || c.is_primary)
                  );

                  this.formData = {
                    id: this.doctor?.doctor_profile.doctor.id ,
                    firstName: this.doctor?.doctor_profile.doctor.first_name,
                    lastName : this.doctor?.doctor_profile.doctor.last_name,
                    secondName: this.doctor?.doctor_profile.doctor.second_name,
                    GENDER:this.doctor?.doctor_profile.doctor.gender,
                    specializations: this.doctor?.doctor_profile.doctor.specializations[0],
                    experience: Number(this.doctor?.doctor_profile?.doctor?.working_experience),
                    specialization_detail: this.doctor?.doctor_profile.doctor.specialization_detail,
                    avatar: this.doctor?.avatar_url ??'',
                    contact: phoneContact?.contact || '',
                    phoneId: phoneContact?.id ?? null,
                    phonePrimary: phoneContact?.is_primary ?? true,
                    email: emailContact?.contact || '',
                    emailId: emailContact?.id ?? null,
                    emailPrimary: emailContact?.is_primary ?? true,
                    appointmentDuration: '30',
                    type: this.doctor?.doctor_profile?.doctor.type,
                    about_myself: this.doctor.doctor_profile.detail.about_myself,
                    address: this.doctor.doctor_profile.detail.address

                  };

                  this.appointmentService.getAppointmentDurationPrivate().subscribe
                  ({
                    next:(data)=>{
                      this.formData.appointmentDuration = String(data);
                      this.isLoading = false;
                    },
                    error:(err)=>{
                      this.status = 'Помилка при трівалості консультаціі:'+ String(err)
                      console.error('Помилка при трівалості консультаціі::', err);
                    }});








                },
                error:(err)=>{
                  this.status = 'Помилка при профіля юриста:'+ String(err)
                  console.error('Помилка при профіля юриста:', err);
                }});







            } else {
              this.coreUserService.get().subscribe
              ({
                next:(res)=>{
                  console.log('email='+res)
                  this.formData.email = res.email;
                  this.isLoading = false;
                },
                error:(err)=>{
                  this.status = 'Помилка при отриманні email:'+ String(err)
                  console.error('Помилка при отриманні email:', err);
                }});

            }


          },
          error:(err)=>{
            this.status = 'Помилка при отриманні типів юристів:'+ String(err)
            console.error('Помилка при отриманні типів юристів:', err);
          }});

      },
      error:(err)=>{
        this.status = 'Помилка при отриманні спеціалізацій юристів:'+ String(err)
        console.error('Помилка при отриманні спеціалізацій юристів:', err);
      }});








  }

  submitPersonalForm(form: NgForm) {
    this.submittedPersonal = true;
    console.log(form.controls)

    if (form.valid) {
      console.log('Особисті дані:', this.formData);
      if (this.roleService.isDoctor()) {
        this.doctorService.update(this.formData).subscribe
        ({
          next: () => {
            this.appointmentService.setAppointmentDuration(this.formData.appointmentDuration).subscribe
            ({
              next:() =>{
                this.router.navigate(['/volunteer-account'])
              },
              error:(err)=>{
                this.pfErrorMessages['appointmentDuration'] = 'Помилка збереження тривалості консультаціі лікаря: ' + String(err);
                console.error('Помилка збереження тривалості консультаціі лікаря: ', err);
              }
            });
          },
          error: (err) => {
            console.error('Помилка додавання персональних даних:', err);
            this.pfErrorMessages = {};
            if (err.error?.properties?.errors) {
              for (const e of err.error.properties.errors) {
                this.pfErrorMessages[e.field] = e.message;
              }
            } else if (err?.status != 200) {
              this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
            }
          }
        });
      }
      else if (this.roleService.isJurist()) {
        console.log(this.formData);
        this.juristService.update(this.formData).subscribe
        ({
          next: () => {
            this.appointmentService.setAppointmentDuration(this.formData.appointmentDuration).subscribe
            ({
              next:() =>{
                this.router.navigate(['/volunteer-account'])
              },
              error:(err)=>{
                this.pfErrorMessages['appointmentDuration'] = 'Помилка збереження тривалості консультаціі юриста: ' + String(err);
                console.error('Помилка збереження тривалості консультаціі юриста: ', err);
              }
            });
          },
          error: (err) => {
            console.error('Помилка додавання персональних даних:', err);
            this.pfErrorMessages = {};
            if (err.error?.properties?.errors) {
              for (const e of err.error.properties.errors) {
                this.pfErrorMessages[e.field] = e.message;
              }
            } else if (err?.status != 200) {
              this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
            }
          }
        });
      }
      else if (this.roleService.isUser() && this.role === 'DOCTOR') {
        this.doctorService.create(this.formData).subscribe
        ({
          next: () => {
            this.roleService.loadUserRoleOnce().then(() => {
              this.appointmentService.setAppointmentDuration(this.formData.appointmentDuration).subscribe
              ({
                next:() =>{
                  this.router.navigate(['/volunteer-edit'])
                },
                error:(err)=>{
                  this.pfErrorMessages['appointmentDuration'] = 'Помилка збереження тривалості консультаціі лікаря: ' + String(err);
                  console.error('Помилка збереження тривалості консультаціі лікаря: ', err);
                }
              });
            });
          },
          error: (err) => {
            console.error('Помилка додавання персональних даних:', err);
            this.pfErrorMessages = {};
            const errors = err?.error?.properties?.errors;
            if (errors) {
              if (Array.isArray(errors)) {
                for (const e of errors) {
                  this.pfErrorMessages[e.field] = e.message;
                }
              }
            } else if (err?.status != 200) {
              this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
            }
          }
        });
      }
      else  {
        this.juristService.create(this.formData).subscribe
        ({
          next: () => {
            this.roleService.loadUserRoleOnce().then(() => {
              this.appointmentService.setAppointmentDuration(this.formData.appointmentDuration).subscribe
              ({
                next:() =>{
                  this.router.navigate(['/volunteer-edit'])
                },
                error:(err)=>{
                  this.pfErrorMessages['appointmentDuration'] = 'Помилка збереження тривалості консультаціі юриста: ' + String(err);
                  console.error('Помилка збереження тривалості консультаціі юриста: ', err);
                }
              });
            });
          },
          error: (err) => {
            console.error('Помилка додавання персональних даних:', err);
            this.pfErrorMessages = {};
            const errors = err?.error?.properties?.errors;
            if (errors) {
              if (Array.isArray(errors)) {
                for (const e of errors) {
                  this.pfErrorMessages[e.field] = e.message;
                }
              }
            } else if (err?.status != 200) {
              this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
            }
          }
        });
      }
    }
  }

  submitAdditionalForm(form: NgForm) {
    this.submittedAdditional = true;
    console.log(form.controls)

    if (form.valid) {
      console.log('Додаткові дані:', this.formData);
      if (this.roleService.isDoctor()) {
        this.doctorService.updateAdditional(this.formData).subscribe
        ({
          next: () => {
            this.router.navigate(['/volunteer-account'])
          },
          error: (err) => {
            console.error('Помилка додавання персональних даних:', err);
            this.pfErrorMessages = {};
            if (err.error?.properties?.errors) {
              for (const e of err.error.properties.errors) {
                this.pfErrorMessages[e.field] = e.message;
              }
            } else if (err?.status != 200) {
              this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
            }
          }
        });
      }
      else if (this.roleService.isJurist()) {
        console.log(this.formData);
        this.juristService.updateAdditional(this.formData).subscribe
        ({
          next: () => {
            this.router.navigate(['/volunteer-account'])
          },
          error: (err) => {
            console.error('Помилка додавання персональних даних:', err);
            this.pfErrorMessages = {};
            if (err.error?.properties?.errors) {
              for (const e of err.error.properties.errors) {
                this.pfErrorMessages[e.field] = e.message;
              }
            } else if (err?.status != 200) {
              this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
            }
          }
        });
      }
      // else if (this.roleService.isUser() && this.role === 'DOCTOR') {
      //   this.doctorService.create(this.formData).subscribe({
      //     next: () => {
      //       this.router.navigate(['/volunteer-account'])
      //     },
      //     error: (err) => {
      //       console.error('Помилка додавання персональних даних:', err);
      //       this.pfErrorMessages = {};
      //       const errors = err?.error?.properties?.errors;
      //       if (errors) {
      //         if (Array.isArray(errors)) {
      //           for (const e of errors) {
      //             this.pfErrorMessages[e.field] = e.message;
      //           }
      //         }
      //       } else if (err?.status != 200) {
      //         this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
      //       }
      //     }
      //   });
      // }
      // else  {
      //   this.juristService.create(this.formData).subscribe({
      //     next: () => {
      //       this.router.navigate(['/volunteer-account'])
      //     },
      //     error: (err) => {
      //       console.error('Помилка додавання персональних даних:', err);
      //       this.pfErrorMessages = {};
      //       const errors = err?.error?.properties?.errors;
      //       if (errors) {
      //         if (Array.isArray(errors)) {
      //           for (const e of errors) {
      //             this.pfErrorMessages[e.field] = e.message;
      //           }
      //         }
      //       } else if (err?.status != 200) {
      //         this.pfErrorMessages['appointmentDuration'] = 'Помилка додавання персональних даних: ' + err?.status;
      //       }
      //     }
      //   });
      // }
    }
  }

  submitContactForm(form: NgForm) {
    this.submittedContact = true;
    if (form.valid) {
      const contact = {
        contact: this.formData.contact,
        type: 'PHONE_NUMBER'
      };
      if (this.formData.phoneId !== null) {
        const updatedContact = {
          ...contact,
          id: this.formData.phoneId,
          is_primary: this.formData.phonePrimary
        };
        console.log('Контактні дані:', [updatedContact]);
        this.contactService.updateAll([updatedContact]).subscribe
        ({
          next: (response) => {
            this.router.navigate(['/volunteer-account'])
          },
          error: (err) => {
            console.error('Помилка додавання контактних даних:', err);
            this.cfErrorMessages = {};
            if (err.error?.properties?.errors) {
              for (const e of err.error.properties.errors) {
                this.cfErrorMessages[e.field] = e.message;
              }
            } else if (err?.status != 200) {
              this.cfErrorMessages['contact'] = 'Помилка додавання контактних даних: ' + err?.status;
            }
          }
        });
        console.log(this.cfErrorMessages)
      } else {
        console.log('Контактні дані:', contact);
        this.contactService.create(contact).subscribe
        ({
          next: (response) => {
            this.router.navigate(['/volunteer-account'])
          },
          error: (err) => {
            console.error('Помилка додавання контактних даних:', err);
            //this.pfErrorMessagesAll = null;
            //this.cfErrorMessages = {};
            if (err.error?.properties?.errors) {
              for (const e of err.error.properties.errors) {
                this.cfErrorMessages[e.field] = e.message;
              }
            } else if (err?.status != 200) {
              this.cfErrorMessages['contact'] = 'Помилка додавання контактних даних: ' + err?.status;
            }
          }
        });
        console.log(this.cfErrorMessages)
      }
    }
  }

  submitAvatar(): void {
    if (!this.avatarFile) return;

    const sizeInMB = this.avatarFile.size / (1024 * 1024);
    if (sizeInMB > 5) {
      this.afErrorMessages = 'Файл занадто великий. Максимальний розмір - 5MB';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result;

      this.avatarService.save(this.formData.id, this.avatarFile!).subscribe
      ({
        next: () => {
          this.router.navigate(['/volunteer-account'])
        },
        error: (err) => {
          console.error('Помилка додавання avatar:', err);
          this.afErrorMessages = '';
          if (err.error?.properties?.errors) {
            for (const e of err.error.properties.errors) {
              this.afErrorMessages += e.message + ' ';
            }
          } else if (err?.status != 200) {
            this.afErrorMessages = 'Помилка додавання аватар: ' + err?.status;
          }
        }
      });
    };

    reader.onerror = () => {
      this.afErrorMessages = 'Не вдалося прочитати файл';
    };
    reader.readAsDataURL(this.avatarFile);
  }

  onFileSelected(event: Event): void {
    this.afErrorMessages = null;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.avatarFile = input.files[0];
    this.submitAvatar();
  }

  protected readonly Object = Object;

}
