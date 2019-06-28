import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
   emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   participantForm:FormGroup;
   loadingRegister:boolean = false;
  constructor(private quizService:QuizService,
              private fb: FormBuilder,private route:Router,
              public toarster:ToastrManager) { }

          participantFormData(){
          this.participantForm=this.fb.group({
          name: [null, Validators.compose([Validators.required])],
          email: [null, Validators.compose([Validators.required])],
          role: [null, Validators.compose([Validators.required])],
          password: [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(10)])],
          confirmPassword: [null, Validators.compose([Validators.required])]
        })
      }
      get getparticipantForm(){
       return this.participantForm.controls;
      }       
  ngOnInit() {
    this.participantFormData();
  }

  addParticipant(){
    if(this.participantForm.invalid){
      return
    }
   
    const name=this.getparticipantForm.name.value;
    const email=this.getparticipantForm.email.value;
    const role=this.getparticipantForm.role.value;
    const password=this.getparticipantForm.password.value;
    const confirmPassword=this.getparticipantForm.confirmPassword.value;
    if(password === confirmPassword){
    console.log(email + name)
    this.loadingRegister = true;
    this.quizService.insertParticipant(name,email,role,password).subscribe(
      data=>{
        this.toarster.successToastr('Successfully registered',null,{toastTimeout:4000})
        this.loadingRegister=false;
        this.route.navigate(['/login'])
        console.log(data);
      },
      (error)=>{
        this.toarster.warningToastr(error.error.warning,null, { toastTimeout: 4000 })
        console.log(error.error.warning);
      }
    )
    }else{
      this.toarster.warningToastr('Password don\'t\ matched',null, { toastTimeout: 4000 })
    }
  }

  
participantUpdate() {
    
  this.quizService.updateParticipant
    (
        1,
      'BigBoy',
      'itaforfrancis122@gmail.com',
       12333,
      '1033',
      '2233'
    )
    .subscribe(
      data => {
        console.log(data)
      },
      error => {
       console.log(error)
        });
  }
}
