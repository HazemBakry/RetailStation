import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-cost-centers-tree',
  templateUrl: './cost-centers-tree.component.html',
  styleUrls: ['./cost-centers-tree.component.css']
})
export class CostCentersTreeComponent implements OnInit {
  CenterControleData: any[] = [];
  CenterData: any[] = [];
  showLoader: boolean;
  SearchText: any;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.GetCostCenterTreeData(true);
  }

  GetCostCenterTreeData(firstLoad = false) {
    if (firstLoad)
      this.showLoader = true;
    this.sharedService.GetCostCenterTreeData().subscribe(data => {
      this.showLoader = false;
      this.CenterControleData = data;
      this.CenterControleData.map(i => {
        if (i.costLevel != 5)
          i['level' + (i.costLevel + 1)] = [];
        i.isCollapse = true;
      });
      this.CreateCenterTreeList();
    });
    console.log(this.CenterData);
  }

  CreateCenterTreeList() {
    let CenterLevels = [...new Set(this.CenterControleData.filter(i => i.costLevel).map(i => i.costLevel))];
    CenterLevels.forEach(level => {
      this.CenterControleData.filter(i => i.costLevel == level).forEach(data => {
        this.CreateCenterLevel(data, level);
      });
    });
  }

  CreateCenterLevel(centerObj: any, level: number) {
    if (level == 1) {
      this.CenterData.push(centerObj);
    } else if (level == 2) {
      let parent = this.CenterData.find(i => i.costCenterID == centerObj.parentID);
      if (parent)
        parent.level2.push(centerObj);
    } else if (level == 3) {
      this.CenterData.forEach(level => {
        let children = level.level2.find(i => i.costCenterID == centerObj.parentID);
        if (children)
          children.level3.push(centerObj);
      });
    } else if (level == 4) {
      this.CenterData.forEach(item => {
        item.level2.forEach(level => {
          let children = level.level3.find(i => i.costCenterID == centerObj.parentID);
          if (children)
            children.level4.push(centerObj);
        });
      });
    } else if (level == 5) {
      this.CenterData.forEach(item => {
        item.level2.forEach(level => {
          level.level3.forEach(sup => {
            let children = sup.level4.find(i => i.costCenterID == centerObj.parentID);
            if (children)
              children.level5.push(centerObj);
          });
        });
      });
    }
  }

  CloseCollapse(parent: any, children: any, isCollapse: boolean) {
    if (!isCollapse)
      return;
    if (parent) {
      this.CenterData.forEach(app => {
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
      let levelNum = children.costLevel;
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
    if (this.SearchText) {
      this.CenterData.map(app => {
        app.level2.map(level2 => {
          level2.level3.map(level3 => {
            level3.level4.map(level4 => {
              level4.level5 = level4.level5.filter(i => i.nameAr.includes(this.SearchText));
              if (level4.level5.length > 0) {
                level4.isCollapse = false;
                level3.isCollapse = false;
                level2.isCollapse = false;
                app.isCollapse = false;
              }
            });
          });
        });
      });
    } else {
      this.CenterData = [];
      this.GetCostCenterTreeData();
    }
  }
}
