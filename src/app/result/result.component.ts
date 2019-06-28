import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal,ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient } from '@angular/common/http';
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  studentsPix():Object{
    return {
      background:'url(assets/images/gettyimages.jpg)',
       'background-size': 'cover',' background-position': 'center', 'padding-bottom': '-150px','color':'white'
      }
    
  }
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
 
  public captureScreen() {
    const printContent = document.getElementById("result_to_print");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=400,border=2,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="./app/result/layer.css">');
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
}