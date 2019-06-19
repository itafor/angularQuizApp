import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  loginForm:FormGroup;
  constructor(private quizService:QuizService,
    private fb: FormBuilder,private route:Router,
    public toarster:ToastrManager) { }

  ngOnInit() {
    this.loginFormData();
  }

  loginFormData(){
    this.loginForm=this.fb.group({
    email: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(10)])],
  })
}
get getLoginForm(){
 return this.loginForm.controls;
}       

login(){
  const email=this.getLoginForm.email.value;
  const password=this.getLoginForm.password.value;
  this.quizService.signIn(email,password).subscribe(
    data=>{
     
        localStorage.clear();
        localStorage.setItem('participant',JSON.stringify(data))
        this.route.navigate(['/quiz'])
      
    },
   error=>{
    this.toarster.warningToastr(error.error.warning,null, { toastTimeout: 4000 })
     console.log(error.error.warning);
   })
}
}
