import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@angular/products';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {

  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId: string;

  constructor(private formBuilder: FormBuilder, private categoriesService: CategoriesService, private messageService: MessageService, private location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff']
    });

    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }
    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value,
    }

    if (this.editMode) {
      this._updateCategory(category);
    }
    else {
      this._addCategory(category);
    }

  }



  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(category).subscribe((category: Category) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category ${category.name} has been updated.` });

      /*
      Note: 1) Timer to add a 2sec delay for user to see toast notification
            2) location.back() redirects user back to their prev location in the app
      */
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category was not updated.' });
        console.log(error);
      });
  }


  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category).subscribe((category: Category) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category ${category.name} has been created.` });

      /*
      Note: 1) Timer to add a 2sec delay for user to see toast notification
            2) location.back() redirects user back to their prev location in the app
      */
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category was not created.' });
        console.log(error);
      });
  }


  get categoryForm() {
    return this.form.controls;
  }


  private _checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.categoriesService.getCategoryById(params.id).subscribe(category => {
          this.currentCategoryId = params.id;
          this.categoryForm.name.setValue(category.name);
          this.categoryForm.icon.setValue(category.icon);
          this.categoryForm.color.setValue(category.color);
        })
      }
    });
  }

  public onCancel() {
    this.location.back();
  }
}
