import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
   emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   participantForm:FormGroup;

  constructor(private quizService:QuizService,
              private fb: FormBuilder,private route:Router) { }

          participantFormData(){
          this.participantForm=this.fb.group({
          name: [null, Validators.compose([Validators.required])],
          email: [null, Validators.compose([Validators.required])],
          role: [null, Validators.compose([Validators.required])]
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
    console.log(email + name)
    this.quizService.insertParticipant(name,email,role).subscribe(
      data=>{
        localStorage.clear();
        localStorage.setItem('participant',JSON.stringify(data))
        this.route.navigate(['/participant'])
        console.log(data);
      },
      (error)=>{
        console.log(error);
      }
    )
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
