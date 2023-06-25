import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralAccountService } from '../../services/general-account.service';

@Component({
  selector: 'app-account-tree',
  templateUrl: './account-tree.component.html',
  styleUrls: ['./account-tree.component.css']
})
export class AccountTreeComponent implements OnInit {
  AccountTreeData: any[] = [];
  isQuota1 = true;
  isQuota2 = true;
  isQuota3 = true;
  AccountData: any[] = [];

  constructor(private modalService: NgbModal, private generalService: GeneralAccountService) { }

  ngOnInit(): void {
    this.GetAccountTreeData();
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  GetAccountTreeData() {
    this.generalService.GetAccountTreeData().subscribe(data => {
      this.AccountTreeData = data;
      this.AccountTreeData.map(i => {
        if (i.accountLevel != 5)
          i['level' + (i.accountLevel + 1)] = [];
        i.isCollapse = true;
      });
      this.CreateTreeAccountList();
    });
  }

  CreateTreeAccountList() {
    let AccountLevels = [...new Set(this.AccountTreeData.filter(i => i.accountLevel).map(i => i.accountLevel))];
    AccountLevels.forEach(level => {
      this.AccountTreeData.filter(i => i.accountLevel == level).forEach((data, i) => {
        this.CreateAccountLevel(data, level);
      });
    });
    console.log(this.AccountData);
  }

  CreateAccountLevel(accountObj: any, level: number) {
    if (level == 1) {
      this.AccountData.push(accountObj);
    } else if (level == 2) {
      let parent = this.AccountData.find(i => i.accountID == accountObj.parentID);
      if (parent)
        parent.level2.push(accountObj);
    } else if (level == 3) {
      this.AccountData.forEach(level => {
        let children = level.level2.find(i => i.accountID == accountObj.parentID);
        if (children)
          children.level3.push(accountObj);
      });
    } else if (level == 4) {
      this.AccountData.forEach(item => {
        item.level2.forEach(level => {
          let children = level.level3.find(i => i.accountID == accountObj.parentID);
          if (children)
            children.level4.push(accountObj);
        });
      });
    } else if (level == 5) {
      this.AccountData.forEach(item => {
        item.level2.forEach(level => {
          level.level3.forEach(sup => {
            let children = sup.level4.find(i => i.accountID == accountObj.parentID);
            if (children)
              children.level5.push(accountObj);
          });
        });
      });
    }
  }

  CloseCollapse(item: any, isCollapse: boolean) {
    if (!isCollapse)
      return;
    this.AccountData.forEach(app => {
      app.isCollapse = true;
      app.level2.forEach(level2 => {
        level2.isCollapse = true;
        level2.level3.forEach(level3 => {
          level3.isCollapse = true;
          level3.level4.forEach(level4 => {
            level4.isCollapse = true;
          });
        });
      });
    })
  }

}
