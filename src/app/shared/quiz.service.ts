import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class QuizService {
readonly rootUrl:string = 'http://127.0.0.1:8000/api/';
readonly imageUrl:string='http://127.0.0.1:8000/';
qns:any[];
seconds:number;
timer;
qnProgress:number;
questionDetailsCode:any;
testDetails:any;
theTestCode:any;


  constructor(private http:HttpClient) {
    this.displayTimeElapse();
   }

 
  
  addQuestion(
    question: string,
    imageName: string,
    option1: string,
    option2: string,
    option3: string,
    option4: string,
    answer: string,
    testCode:string,
  ) {
    return this.http.post<any>(this.rootUrl +  `addNewQuestion`, {
        question,
        imageName,
        option1,
        option2,
        option3,
        option4,
        answer,
        testCode,
      })
      .pipe();
  }

  getQuestions(){
    return this.http.get(this.rootUrl + 'get-questions')
  }

  groupQuestionsByCode(){
    return this.http.get(this.rootUrl + 'get-groupedQuestions')
  }
 
  insertParticipant(
    name:string,
    email:string,
    score:number,
    TimeSpent:string,
    testCode:string
    ){
    return this.http.post<any>(this.rootUrl + `insertParticipants`, 
    {name,email,score,TimeSpent,testCode})
    .pipe();
  }

  updateParticipant(
    id:number,
    name:string,
    email:string,
    score:number,
    TimeSpent:string,
    testCode:string
    ){
    return this.http.put(this.rootUrl + `updateParticipant/` + id, 
    {name,email,score,TimeSpent,testCode})
    .pipe();
  }

  displayTimeElapse(){
    let hour=Math.floor(this.seconds/360);
    let minutes = Math.floor(this.seconds / 60);
    let seconds = Math.floor(this.seconds % 60);
    return hour + ':' + minutes + ':' + seconds
  }

  
  addTest(
    subjectName: string,
    numberOfQn: number,
    duration: number,
    testCode: string,
  ) {
    return this.http.post<any>(this.rootUrl +  `newTest`, {
      subjectName,
      numberOfQn,
      duration,
      testCode,
      })
      .pipe();
  }


  getTest(){
    return this.http.get(this.rootUrl + 'get-test')
  }

  getAllQuestions(code:any){
    return this.http.get(this.rootUrl + 'display-questions/' + code)
  }

  deleteQuestion(_id: number) {
    return this.http.delete(this.rootUrl + `delete-question/` + _id);
  }

  deleteTest(_id: number) {
    return this.http.delete(this.rootUrl + `delete-test/` + _id);
  }


  updateQuestion(
    id:number,
    Qn:string,
    ImageName:string,
    Option1:string,
    Option2:string,
    Option3:string,
    Option4:string,
    answer:string,
    testCode:string
    ){
    return this.http.put(this.rootUrl + `update-question/` + id, 
    {Qn,ImageName,Option1,Option2,Option3,Option4,answer,testCode})
    .pipe();
  }

  
  updateTest(
    id:number,
    subjectName:string,
    numberOfQn:string,
    duration:string,
    testCode:string,
    ){
    return this.http.put(this.rootUrl + `update-test/` + id, 
    {subjectName,numberOfQn,duration,testCode})
    .pipe();
  }

  
  getTestDetail(code:any){
    return this.http.get(this.rootUrl + 'get-testdetail/' + code)
  }

  sendFile(formData: any){ 
return this.http.post(this.rootUrl  +  `addNewQuestion`,formData)
}

}

