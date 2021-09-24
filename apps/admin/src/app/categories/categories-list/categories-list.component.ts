import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@angular/products'
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endSubscriptions$: Subject<any> = new Subject();

  constructor(private categoriesService: CategoriesService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {
    this._getCategories();
  }

  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this category - ${categoryId}?`,
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category has been deleted.' });
          this._getCategories();
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category was not deleted.' });
            // console.log(error);
          });
      }
    });

  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endSubscriptions$)).subscribe(categoryData => {
      this.categories = categoryData;
    })
  }

  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }
}
