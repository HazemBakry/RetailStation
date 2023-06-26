import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accounts-tree',
  templateUrl: './accounts-tree.component.html',
  styleUrls: ['./accounts-tree.component.css']
})
export class AccountsTreeComponent implements OnInit {
  AccountTreeData: any[] = [];
  AccountData: any[] = [];
  showLoader: boolean;
  SearchText: any;

  constructor(private sharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetAccountTreeData(true);
  }

  GetAccountTreeData(firstLoad = false) {
    if (firstLoad)
      this.showLoader = true;
    this.sharedService.GetAccountTreeData().subscribe(data => {
      this.showLoader = false;
      this.AccountTreeData = data;
      this.AccountTreeData.map(i => {
        if (i.accountLevel != 5)
          i['level' + (i.accountLevel + 1)] = [];
        i.isCollapse = true;
      });
      this.CreateTreeAccountList();
      console.log(this.AccountTreeData);
    });
    console.log(this.AccountData);

  }

  CreateTreeAccountList() {
    let AccountLevels = [...new Set(this.AccountTreeData.filter(i => i.accountLevel).map(i => i.accountLevel))];
    AccountLevels.forEach(level => {
      this.AccountTreeData.filter(i => i.accountLevel == level).forEach(data => {
        this.CreateAccountLevel(data, level);
      });
    });
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

  CloseCollapse(parent: any, children: any, isCollapse: boolean) {
    if (!isCollapse)
      return;
    if (parent) {
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
      });
    } else {
      let levelNum = children.accountLevel;
      if (levelNum == 2) {
        children.level3.forEach(level3 => {
          level3.isCollapse = true;
          level3.level4.forEach(level4 => {
            level4.isCollapse = true;
          });
        });
      } else if (levelNum == 3) {
        children.level4.forEach(level4 => {
          level4.isCollapse = true;
        });
      }
    }
  }

  OnSearchClick() {
    let returnFunc = false;
    if (this.SearchText) {
      this.AccountData.forEach(app => {
        if (returnFunc) {
          return;
        }
        app.level2.forEach(level2 => {
          level2.level3.forEach(level3 => {
            level3.level4.forEach(level4 => {
              let list = level4.level5.filter(i => i.nameAr.includes(this.SearchText));
              if (list.length > 0) {
                level4.level5 = level4.level5.filter(i => i.nameAr.includes(this.SearchText));
                level4.isCollapse = false;
                level3.isCollapse = false;
                level2.isCollapse = false;
                app.isCollapse = false;
                returnFunc = true;
              }
            });
          });
        });
      });
    } else {
      this.AccountData = [];
      this.GetAccountTreeData();
    }
  }


}
