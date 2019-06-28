import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  contactForm:FormGroup;
  emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  loadingContactus:boolean=false;
  constructor(private quizService:QuizService,
    private fb: FormBuilder,private route:Router,
    public toarster:ToastrManager) { }

  ngOnInit() {
    this. contactFormData();
  }

  styleObject(): Object {
        return {background: 'url(assets/images/question-mark.jpg)', height: '100vh',
         'background-size': 'cover',' background-position': 'center','margin-top':'-30px'}
    }

    studentsPix():Object{
      return {
        background:'url(assets/images/gettyimages.jpg)',
         'background-size': 'cover',' background-position': 'center', 'padding-bottom': '-150px','width':'100%'
        }
      
    }

    contactFormData(){
      this.contactForm=this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      message: [null, Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(100)])],
    })
  }
  get getContactForm(){
   return this.contactForm.controls;
  }  
  contactus(){
  if(this.contactForm.invalid){
    return;
  }
  this.loadingContactus=true;
  const email=this.getContactForm.email.value;
  const message=this.getContactForm.message.value;
  console.log(email, message)
  this.quizService.contact(email,message).subscribe(
    data=>{
    this.toarster.successToastr('Thanks for contacting us, we will get back to you shortly',null, { toastTimeout: 4000 })
      this.contactForm.reset();
      this.loadingContactus=false;
    },
   error=>{
    this.toarster.errorToastr(error.error.error,null, { toastTimeout: 4000 })
     console.log(error.error.error);
   })
}
}
