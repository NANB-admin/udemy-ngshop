import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Product, ProductsService } from '@angular/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-product-form',
  templateUrl: './product-form.component.html',
  styles: [
  ]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form: FormGroup;
  isSubmitted = false;
  currentProductId: string
  categories = [] as any;
  imageDisplay: string | ArrayBuffer;
  endSubscriptions$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnDestroy(): void {
    // console.log('categories is destroyed');
    this.endSubscriptions$.next();
    this.endSubscriptions$.complete();
  }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      numReviews: [0],
      rating: [0],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });
    if (this.editMode) {
      this._editProduct(productFormData);
    }
    else {
      this._addProduct(productFormData);
    }

  }

  get productForm() {
    return this.form.controls;
  }

  /*
  Call get categories to display category options in dropdown on product form page.
  */
  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endSubscriptions$)).subscribe(categories => {
      this.categories = categories;
    })
  }

  onImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          this.imageDisplay = fileReader.result;
        }
      };
      fileReader.readAsDataURL(file);
    }
  }


  private _addProduct(productData: FormData) {
    this.productService.createProduct(productData).pipe(takeUntil(this.endSubscriptions$)).subscribe((product: Product) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} has been created.` });

      /*
      Note: 1) Timer to add a 2sec delay for user to see toast notification
            2) location.back() redirects user back to their prev location in the app
      */
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product was not created.' });
        console.log(error);
      });
  }

  private _editProduct(productData: FormData) {
    this.productService.updateProduct(productData, this.currentProductId).pipe(takeUntil(this.endSubscriptions$)).subscribe((product: Product) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} has been updated.` });

      /*
      Note: 1) Timer to add a 2sec delay for user to see toast notification
            2) location.back() redirects user back to their prev location in the app
      */
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product was not updated.' });
        console.log(error);
      });
  }

  private _checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.productService.getProductById(params.id).pipe(takeUntil(this.endSubscriptions$)).subscribe(product => {
          this.currentProductId = params.id;
          this.productForm.name.setValue(product.name);
          this.productForm.category.setValue(product.category?.id);
          this.productForm.brand.setValue(product.brand);
          this.productForm.price.setValue(product.price);
          this.productForm.description.setValue(product.description);
          this.productForm.richDescription.setValue(product.richDescription);
          this.productForm.countInStock.setValue(product.countInStock);
          this.productForm.numReviews.setValue(product.numReviews);
          this.productForm.rating.setValue(product.rating);
          this.productForm.isFeatured.setValue(product.isFeatured);

          if (product.image) {
            this.imageDisplay = product.image;
          }
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();

        })
      }
    });
  }

  public onCancel() {
    this.location.back();
  }

}
