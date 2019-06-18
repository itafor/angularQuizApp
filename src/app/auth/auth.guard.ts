import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NEXT } from '@angular/core/src/render3/interfaces/view';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private route:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    let users=JSON.parse(localStorage.getItem('participant'));
    if(localStorage.getItem('participant') !=null){
      return true;
    }else if(localStorage.getItem('participant') !=null && users.role ==="candidate"){
      this.route.navigate(['/quiz']);
      return false;
    }else{
      this.route.navigate(['/register']);
      return false;
    }
 
  }
  
}
