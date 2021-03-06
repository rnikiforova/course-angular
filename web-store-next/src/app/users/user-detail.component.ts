import { Component, Input, OnInit, SimpleChange } from "@angular/core";
import { Location } from "@angular/common";
import { User, UserImpl, Gender, Role } from "./user.model";
import { UserService } from "./user.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { tap } from "rxjs/operators";
import { shallowEquals } from '../shared/utils';
import { DialogService } from '../core/dialog.service';

@Component({
  // moduleId: module.id,
  selector: "user-detail",
  templateUrl: "./user-detail.component.html",
  styles: [
    `
  .radio-inline {
    width: 6em;
    margin-bottom: 10px;
  }
  .button-panel {
    margin-top: 30px;
  }`
  ]
})
export class UserDetailComponent implements OnInit {
  @Input("user") public userMaster: User = { id: undefined } as User;
  public user: User;
  public title: string;
  public GENDER_MALE: Gender = Gender.MALE;
  public GENDER_FEMALE: Gender = Gender.FEMALE;
  public ROLE_CUSTOMER: Role = Role.CUSTOMER;
  public ROLE_OPERATOR: Role = Role.OPERATOR;
  public ROLE_ADMIN: Role = Role.ADMIN;

  public isNewUser: boolean = false;
  private isSaved = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: UserService,
    private dialogService: DialogService
  ) {}

  public ngOnInit() {
    this.userMaster = new UserImpl();
    this.resetForm();
    this.route.params.forEach((params: Params) => {
      let id = params["id"]; // (+) converts string 'id' to a number
      this.isNewUser = true; // new
      if (id) {
        this.isNewUser = false; // has Id => not new
        this.service.find(id).subscribe(user => {
          this.userMaster = user;
          this.resetForm();
        });
      }
    });
    this.route.data
      .pipe(tap(data => console.log(JSON.stringify(data))))
      .subscribe((data: Params) => {
        this.title = data["title"];
      });
  }

  public ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    let chng = changes["user"];
    if (chng.currentValue !== chng.previousValue) {
      this.resetForm();
    }
  }

  public resetForm() {
    this.user = Object.assign({}, this.userMaster);
  }

  public onSubmit() {
    this.user.role = +this.user.role;
    if (this.isNewUser) {
      this.service.add(this.user).subscribe(user => {
        this.isSaved = true;
        this.gotoUsers();
      });
    } else {
      this.service.update(this.user).subscribe(user => {
        this.isSaved = true;
        this.gotoUsers()
      });
    }
  }

  public gotoUsers() {
    this.router.navigate(["/users", { selectedId: this.userMaster.id }]);
  }

  cancelForm() {
    this.isSaved = true;
    this.gotoUsers()
  }

  public canDeactivate(): Promise<boolean> | boolean {
    // Allow navigation if no user or the user data is not changed
    if (this.isSaved || shallowEquals(this.user, this.userMaster)) {
      return true;
    }
    // Otherwise ask the user to confirm loosing changes using the dialog service
    return this.dialogService.confirm('Discard changes?');
  }
}
