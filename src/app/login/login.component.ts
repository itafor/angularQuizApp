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
  examinalLoginForm:FormGroup
  theTestDetail:any;
  logTestCode:any;
  textInstruction:any
  constructor(private quizService:QuizService,
    private fb: FormBuilder,private route:Router,
    public toarster:ToastrManager) { }

  ngOnInit() {
    this.loginFormData();
   this.examinalLoginFormData();
  }

  loginFormData(){
    this.loginForm=this.fb.group({
    email: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(10)])],
    code: [null, Validators.compose([Validators.required])],
  })
}

get getLoginForm(){
  return this.loginForm.controls;
  } 
     

examinalLoginFormData(){
  this.examinalLoginForm=this.fb.group({
  email: [null, Validators.compose([Validators.required])],
  password: [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(10)])],
  examinal:[null, Validators.compose([Validators.required])],
})
}

get getExaminalLoginForm(){
  return this.examinalLoginForm.controls;
 }  

getTestCode(code:any){
  let kode=code.target.value;
this.quizService.getTestDetail(kode).subscribe(data=>{
  this.theTestDetail=data;
  this.logTestCode=this.theTestDetail && this.theTestDetail.testCode ? this.theTestDetail.testCode: null;
        localStorage.setItem('logTestCode', JSON.stringify(this.logTestCode));
        this.textInstruction=this.theTestDetail && this.theTestDetail.instruction ? this.theTestDetail.instruction: null;
        localStorage.setItem('textInstruction', JSON.stringify(this.textInstruction));
        console.log('the test instruction',JSON.parse(localStorage.getItem('textInstruction')));
       
})
}


candidateLogin(){
  if(JSON.parse(localStorage.getItem('logTestCode')) == null){
    this.toarster.warningToastr('Invalid test code, please enter the test code provided by your examinal',null, { toastTimeout: 5000 });
    return;
  }
  const email=this.getLoginForm.email.value;
  const password=this.getLoginForm.password.value;
  const code=this.getLoginForm.code.value;
  this.quizService.signIn(email,password).subscribe(
    data=>{
        localStorage.clear();
        localStorage.setItem('participant',JSON.stringify(data))
        this.route.navigate(['/quiz']);
        localStorage.setItem('mylogTestCode', JSON.stringify(code));
        this.textInstruction=this.theTestDetail && this.theTestDetail.instruction ? this.theTestDetail.instruction: null;
        localStorage.setItem('textInstruction', JSON.stringify(this.textInstruction));
        console.log('the test instruction 2...',JSON.parse(localStorage.getItem('textInstruction')));
       
    },
   error=>{
    this.toarster.warningToastr(error.error.warning,null, { toastTimeout: 4000 })
     console.log(error.error.warning);
   })
}

examinalLogin(){
  if(this.examinalLoginForm.invalid){
    return;
  }
  const email=this.getExaminalLoginForm.email.value;
  const password=this.getExaminalLoginForm.password.value;
  const examinal=this.getExaminalLoginForm.examinal.value;
  this.quizService.examinaleSignIn(email,password,examinal).subscribe(
    data=>{
        localStorage.clear();
        localStorage.setItem('participant',JSON.stringify(data))
        this.route.navigate(['/testList']);
    },
   error=>{
    this.toarster.warningToastr(error.error.warning,null, { toastTimeout: 4000 })
     console.log(error.error.warning);
   })
}

}
