import { AfterViewInit, Component, OnInit, Optional,ElementRef, ViewChild,Inject  } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit{
  
form:FormGroup;
options:any=[];
optOne:any;
test:any;
choices : any;
choice:any;
pos:number=0;
correct:number=0;
displayFinalResult:any='';
testCompletedMessage:any='';
  constructor(private quizService:QuizService, route:Router,
    private elem: ElementRef, private fb: FormBuilder,private _activatedRoute:ActivatedRoute) {
    
     }

  ngOnInit() {
    if(this.quizService.theTestCode){
      this.getQuix(this.quizService.theTestCode);
    }
    this.opts();
    this.quizFormField();


    let code:string = this._activatedRoute.snapshot.params['Code'];
    this.quizService.questionDetailsCode=code;
    if(code){
      this.getAllQuestions(code);
      this.quizService.displayTimeElapse();
    }
  }

  getAllQuestions(code:any){
    
    this.quizService.getAllQuestions(code).subscribe(
      data=>{
        this.quizService.qns = <any[]>data;
      },
      error=>{
        console.log(error);
      }
    )
    }

  quizFormField() {
    this.form = this.fb.group({
      choices:[null, Validators.compose([Validators.required])]
    });
  }

  get getFormData(){
    return this.form.controls;
  }

  getQuix(code:any){
    this.quizService.seconds=0;
    this.quizService.qnProgress=0;
    this.quizService.getAllQuestions(code).subscribe(
      (data:any)=>{
        this.quizService.qns = data;
        this.setTimer();
      console.log(data)
    },
    (error)=>{
      console.log(error)
    })
  }

  opts(){
   this.quizService.getQuestions().subscribe(
    (data:any)=>{

    for (var i=0; i<data.length; i++){
          delete data[i].Qn;
          delete data[i].ImageName;
          delete  data[i].answer;
          delete data[i].created_at;
          delete data[i].remember_token;
          delete data[i].testCode;
          delete data[i].updated_at;
          delete data[i].id;
          this.options.push(data[i])
    }
    console.log(this.options)
   this.renderQuestions();

   });
  }

  renderQuestions(){
  if(this.pos >=this.quizService.qns.length){
    this.displayFinalResult="You got " + this.correct + " of " + this.quizService.qns.length + " questions correct";
    this.testCompletedMessage="test completed";
   this.pos=0;
    this.correct=0;
    return false;
  }
  this.displayFinalResult="Questions " + (this.pos + 1) + " of " + this.quizService.qns.length;
  }

  

  checkAnswer(){
    if(this.form.invalid){
      return;
    }
    const choices=this.getFormData.choices.value;
    this.quizService.qnProgress++;
    
    if(this.quizService.qnProgress === this.quizService.qns.length){
      clearInterval(this.quizService.timer);
    }
		 	if(choices === this.quizService.qns[this.pos].answer){
         this.correct++;
         console.log('correct')
		 	}

		 this.pos++;
		 this.renderQuestions();
      this.form.reset();
  }

  setTimer(){
    this.quizService.timer=setInterval(()=>{
      this.quizService.seconds++;
    },1000)
  }

}
