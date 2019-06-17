import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal,ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  resultList:any[];
  theTestDetail:any;
  testCode:any;
duration:number;
theTestCode:any;
testTitle:string;
maximumScore:number;
  constructor(public quizService:QuizService,
    public _activatedRoute:ActivatedRoute, public fb: FormBuilder,
    config: NgbModalConfig,public toarster:ToastrManager,public http:HttpClient,
    public modalService: NgbModal) { }

  ngOnInit() {
    let code:string = this._activatedRoute.snapshot.params['Code'];
    localStorage.setItem('resultTestCode',JSON.stringify(code));
    let retrievedCode= JSON.parse(localStorage.getItem('resultTestCode'));
    console.log('resultTestCode', retrievedCode);
    if(code){
     this.displayResult(code);
     this.testDetails(code);
    }
  }

  displayResult(code:any){
    this.quizService.showResults(code).subscribe( 
      (data:any)=>{
        this.resultList = data;
        console.log('results',data);
     this.maximumScore = this.resultList[0].maxScore;
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  deleteResult(id:number){
    console.log(id);
  }

  testDetails(code:any){
    this.quizService.getTestDetail(code).subscribe(
      data=>{
        this.theTestDetail=data;
        console.log('the test details', this.theTestDetail)
        this.duration=this.theTestDetail && this.theTestDetail.duration ? Number(this.theTestDetail.duration): null;
        localStorage.setItem('duration',this.duration.toString());
        this.testTitle=this.theTestDetail && this.theTestDetail.subjectName ? this.theTestDetail.subjectName: null;
        localStorage.setItem('testTitle', JSON.stringify(this.testTitle));
        this.theTestCode=this.theTestDetail && this.theTestDetail.testCode ? this.theTestDetail.testCode: null;
        localStorage.setItem('theTestCode', JSON.stringify(this.theTestCode));
      },
      error=>{
        console.log(error)
      }
    )
  }
 
}
