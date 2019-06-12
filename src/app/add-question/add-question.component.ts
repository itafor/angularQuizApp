import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  public addQuestionForm:FormGroup;
  questCode:any;
  alternateCode:any;
  subject:any;
  numberOfQtns:any;
  constructor(
    public quizService:QuizService,
    public fb: FormBuilder,public _activatedRoute:ActivatedRoute
    ) { }

    questionsFormFields() {
      this.addQuestionForm = this.fb.group({
        question: [null, Validators.compose([Validators.required])],
        imageName: [null],
        option1: [null, Validators.compose([Validators.required])],
        option2: [null, Validators.compose([Validators.required])],
        option3:[null, Validators.compose([Validators.required])],
        option4:[null, Validators.compose([Validators.required])],
        answer: [null, Validators.compose([Validators.required])],
        marks: [null, Validators.compose([Validators.required])],
        testCode:[null, Validators.compose([Validators.required])],
      });
    }

    get getQuestions() { return this.addQuestionForm.controls; }

  ngOnInit() {
    let code:string = this._activatedRoute.snapshot.params['Code'];
    this.alternateCode=code;
    this. questionsFormFields();
    
    if(this.quizService.testDetails.testCode){
      this.questCode=this.quizService.testDetails.testCode;
      this.subject=this.quizService.testDetails.subjectName;
      this.numberOfQtns=this.quizService.testDetails.numberOfQn;
      console.log(this.numberOfQtns)
     }
  }

  postQuestion(){
  if(this.addQuestionForm.invalid){
    return;
  }

  const question=this.getQuestions.question.value;
  const imageName=this.getQuestions.imageName.value;
  const option1=this.getQuestions.option1.value;
  const option2=this.getQuestions.option2.value;
  const option3=this.getQuestions.option3.value;
  const option4=this.getQuestions.option4.value;
  const answer=this.getQuestions.answer.value;
  const marks=this.getQuestions.marks.value;
  const testCode=this.getQuestions.testCode.value;
console.log(question + imageName + option1+ ' ' +option2+option3 + option4 + answer + testCode)
  this.quizService.addQuestion(question,imageName,option1,option2,option3,option4,answer,marks,testCode)
  .subscribe( data=>{
console.log(data);
  },
  (error)=>{
console.log(error);
  })
}


}