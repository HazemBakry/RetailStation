import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/Admin.service';
import { Tag } from '../../models/TagsManagerModels';

@Component({
  selector: 'app-tags-manager',
  templateUrl: './tags-manager.component.html',
  styleUrls: ['./tags-manager.component.css']
})
export class TagsManagerComponent implements OnInit {
  TitleList = ['إدارة النظام', 'إدارة الوسوم'];
  tags: Tag[] = [];
  items: any[] = [];
  selectedTag?: Tag;
  selectedTagItems: any[] = [];
  tagForm: FormGroup;
  highlightedItem: any | null = null;


  constructor(private adminService: AdminService,
    private fb: FormBuilder,
    private toaster: ToastrService
  ) {

    this.tagForm = this.fb.group({
      tagId: [null],
      name: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.loadTags();
    this.loadAllItems();
  }

  loadTags() {
    this.adminService.getTags().subscribe(tags => this.tags = tags);
  }

  loadAllItems() {
    this.adminService.getAllItems().subscribe(items => this.items = items);
  }

  selectTag(tag: Tag) {
    this.selectedTag = tag;
    this.tagForm.patchValue(tag);
    this.adminService.getItemsForTag(tag.tagId).subscribe(tagItems => {
      this.selectedTagItems = tagItems;
    });
  }

  saveTag() {
    const tag = this.tagForm.value as Tag;
    if (tag.tagId) {
      this.adminService.updateTag(tag).subscribe(() => this.loadTags());
    } else {
      this.adminService.createTag({ name: this.tagForm.value.name }).subscribe(() => this.loadTags());
    }
    this.tagForm.reset();
    this.selectedTag = undefined;
    this.selectedTagItems = [];
  }

  deleteTag(tagId: number) {
    this.adminService.deleteTag(tagId).subscribe(() => {
      this.loadTags();
      if (this.selectedTag?.tagId === tagId) {
        this.selectedTag = undefined;
        this.selectedTagItems = [];
      }
    });
  }

  toggleItemForTag(item: any, checked: boolean) {
    if (!this.selectedTag) return;
    if (checked) {
      this.adminService.assignItemToTag(this.selectedTag.tagId, item.foodItemId)
        .subscribe(() => this.selectedTagItems.push(item));
    } else {
      this.adminService.unassignItemFromTag(this.selectedTag.tagId, item.foodItemId)
        .subscribe(() => {
          this.selectedTagItems = this.selectedTagItems.filter(i => i.foodItemId !== item.foodItemId);
        });
    }
  }

  isItemSelected(item: any): boolean {
    return this.selectedTagItems.some(i => i.foodItemId === item.foodItemId);
  }

  cancelEdit() {
    this.tagForm.reset();
    this.selectedTag = undefined;
    this.selectedTagItems = [];
  }

  onToggleStatus(tag: any): void {
    const originalValue = tag.isActive;
    tag.isActive = !tag.isActive;

    this.adminService.updateIsActive(tag.tagId, tag.isActive).subscribe({
      next: () => {
      },
      error: () => {
        this.toaster.error('Failed to update status');
        tag.isActive = originalValue; // Revert on failure
      }
    });
  }

  highlightInAssignList(item: any) {
    this.highlightedItem = item;
    // Optional: auto-scroll to that item in assign list
    setTimeout(() => {
      const el = document.querySelector(`[data-item-id='${item.foodItemId}']`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }

}
