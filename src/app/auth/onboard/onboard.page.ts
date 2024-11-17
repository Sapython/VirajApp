import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {
  checkingUsername:boolean = false;
  userNameAvailable:'invalid'|'available'|'unavailable'|'checking' = 'checking';
  checkUsername:Subject<string|number|null|undefined> = new Subject<string|number|null|undefined>();
  loginModalVisible:boolean = false;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('',[Validators.required,Validators.minLength(4),Validators.pattern('[a-zA-Z0-9]*')]),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
  });

  onboardingBusinessForm:FormGroup = new FormGroup({  
    name:new FormControl('',[Validators.required]),
    address:new FormControl('',[Validators.required]),
    phone:new FormControl('',[Validators.required,Validators.pattern('[0-9]{10}')]),
    email:new FormControl('',[Validators.required,Validators.email]),
    username:new FormControl('',[Validators.required,Validators.minLength(4),Validators.pattern('[a-zA-Z0-9]*')]),
    fssai:new FormControl(''),
    gst:new FormControl(''),
  })
  constructor(private authService:AuthService) {
    this.checkUsername.subscribe((value)=>{
      this.checkingUsername = true;
    })
    this.checkUsername.pipe(debounceTime(1000)).subscribe((value)=>{
      this.checkingUsername = true;
      if (value == null || value == undefined || value == '') {
        this.checkingUsername = false;
        this.userNameAvailable = 'invalid';
        // mark as touched and invalid
        this.onboardingBusinessForm.get('username')?.markAsTouched();
        this.onboardingBusinessForm.get('username')?.setErrors({invalid:true});
        return;
      }
      this.authService.checkUsernameAvailability(value.toString()).then((result:any)=>{
        this.checkingUsername = false;
        this.userNameAvailable = result.data['stage'];
        if (this.userNameAvailable == 'unavailable'){
          this.loginModalVisible = true;
          this.loginForm.patchValue(this.onboardingBusinessForm.value);
        }
      }).catch((error)=>{
        this.checkingUsername = false;
        this.userNameAvailable = 'invalid';
      })
    })
  }

  ngOnInit() {
  }

}
