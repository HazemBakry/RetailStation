import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';

@Directive({
  selector: '[appRole]'
})
export class RoleCheckerDirective {
  // if need to check specific roles like 'Supervisor', 'Manager'
  @Input() roles: string | string[]; 

  // if need to check specific action in specific page >> 'view','save' in 'order list' page
  @Input() actions: string | string[];
  @Input() pageName: string ;

  constructor(
    private ref: ElementRef<HTMLElement>,
    private authService: AuthService ,
    private route:ActivatedRoute
  ) { }

  // ngOnInit(): void {
    
  //   // const userRoles = this.authService.getUserRoles(); // Get user roles from AuthService
  //   if(this.roles) {
  //     const allowedRoles = Array.isArray(this.roles) ? this.roles : [this.roles];

  //     if (!this.authService.isInRole(allowedRoles)) 
  //       this.ref.nativeElement?.remove();
  //   }
  //   else if(this.actions)
  //   {
  //     this.route.data.subscribe(data => {
  //       this.pageName=data["pageName"];
       
  //     });
     

  //     const allowedActions = Array.isArray(this.actions)? this.actions : [this.actions];
  //     if (!this.authService.haveActionPermission(allowedActions,this.pageName)) 
  //       this.ref.nativeElement?.remove();

  //   }
  // }

  ngOnInit(): void {
    if (this.roles) {
      const allowedRoles = Array.isArray(this.roles) ? this.roles : [this.roles];
      if (!this.authService.isInRole(allowedRoles)) {
        this.ref.nativeElement?.remove();
        return;
      }
    } else if (this.actions) {
      //preferred to send pageName as input
      if (!this.pageName) {
        this.route.data.subscribe(data => {
          this.pageName = data["pageName"];
        });
      }
      // const allowedActions = Array.isArray(this.actions) ? this.actions : [this.actions];
      if (!this.authService.haveActionPermission(this.actions, this.pageName)) {
        this.ref.nativeElement?.remove();
        return;
      }
    }
  }
}
