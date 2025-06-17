import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {User} from '../../data/interfaces/User.interface';
import {AvatarService} from '../../data/services/avatar.service';
import {ContactService} from '../../data/services/contacts.service';
import {UserService} from '../../data/services/user.service';
import {RoleService} from '../../data/services/role.service';
import {CoreUsersService} from '../../data/services/core-users.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.scss'
})
export class UserEditPageComponent {
  constructor(
    private router: Router,
    private avatarService: AvatarService,
    private contactService: ContactService,
    private userService: UserService,
    protected roleService: RoleService,
    private coreUserService: CoreUsersService
  ) {}

  //@Input() subtitle!:string;
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
    birthDate:'',
    avatar: '',
    contact:'',
    phoneId: null as number | null,
    phonePrimary: true,
    email: '',
    emailId: null as number | null,
    emailPrimary: true,
  };


  doctorId: string | null | undefined;
  user: User = {} as User;
  submittedPersonal = false;
  submittedContact = false;

  avatarFile: File | null = null;
  avatarPreview: string | ArrayBuffer | null = '/assets/images/default-user.png';

  title = 'Створення профілю користувача';
  isLoading: boolean = true;
  status: string = 'Завантаження ...';
  ngOnInit() {
    if (this.roleService.isCustomer()) {
      this.title = 'Редагування профілю користувача';
      this.userService.get().subscribe
      ({
        next:(res)=>{
          this.isLoading = false;

          this.user = res;
          console.log(this.user);
          if (this.user.avatar_url) {
            this.avatarPreview = this.user.avatar_url
          }

          const phoneContact = this.user.contacts.find(c =>
            c.type === 'PHONE_NUMBER'
          );

          const emailContact = this.user.contacts.find(c =>
            c.type === 'EMAIL' && (c.is_primary || c.is_primary)
          );

          this.formData = {
            id: this.user?.customer_profile.id,
            firstName: this.user?.customer_profile.first_name,
            lastName : this.user?.customer_profile.last_name,
            secondName: this.user?.customer_profile.second_name,
            GENDER:this.user?.customer_profile.gender,
            avatar: this.user?.avatar_url ?? '',
            birthDate: this.user?.customer_profile.birthday_date,
            contact: phoneContact?.contact || '',
            phoneId: phoneContact?.id ?? null,
            phonePrimary: phoneContact?.is_primary ?? true,
            email: emailContact?.contact || '',
            emailId: emailContact?.id ?? null,
            emailPrimary: emailContact?.is_primary ?? true
          };

          console.log(this.formData)
        },
        error:(err)=>{
          this.status = 'Помилка при отриманні профіля:'+ String(err)
          console.error('Помилка при отриманні профіля:', err);
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
  }

  submitPersonalForm(form: NgForm) {
    this.submittedPersonal = true;

    if (!form.valid) return;

    console.log('Особисті дані:', this.formData);

    if (this.roleService.isCustomer()) {
      this.userService.update(this.formData).subscribe
      ({
        next: () => {
          this.router.navigate(['/user-account']);
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
            this.pfErrorMessages['GENDER'] = 'Помилка додавання персональних даних: ' + err?.status;
          }
        }
      });
    } else {
      this.userService.create(this.formData).subscribe
      ({
        next: () => {
          this.roleService.loadUserRoleOnce().then(() => {
            this.router.navigate(['/user-account']);
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
            this.pfErrorMessages['GENDER'] = 'Помилка додавання персональних даних: ' + err?.status;
          }
        }
      });

    }
  }

  submitContactForm(form: NgForm) {
    this.submittedContact = true;
    if (form.valid) {
      // if (this.formData.emailId !== null) {
      //   contactsToUpdate.push({
      //     id: this.formData.emailId,
      //     contact: this.formData.email,
      //     type: 'EMAIL',
      //     is_primary: this.formData.emailPrimary,
      //   });
      // }
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
            this.router.navigate(['/user-account'])
          }, error: (err) => {
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
            this.router.navigate(['/user-account'])
            //this.pfErrorMessages = {};
            //this.pfErrorMessagesAll = 'Заповніть персональні данні';
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

      // Отправка файла только после загрузки превью (если нужно)
      this.avatarService.save(this.formData.id, this.avatarFile!).subscribe
      ({
        next: () => {
          this.router.navigate(['/user-account']);
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
