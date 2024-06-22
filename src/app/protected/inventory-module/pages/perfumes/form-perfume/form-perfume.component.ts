import { Component, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileRemoveEvent, FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import Swal, { SweetAlertOptions } from 'sweetalert2';

import { APIPerfumeResponse, Brand, Gender, Perfume, PerfumeImage } from '../../../interfaces/perfumes.interfaces';
import { ErrorMsgDirective } from '../../../directives/error-msg.directive';
import { PerfumesService } from '../../../services/perfumes.service';
import { BrandModalComponent } from '../../../components/brand-modal/brand-modal.component';

@Component({
    selector: 'app-form-perfume',
    standalone: true,
    imports: [
        DecimalPipe,
        NgClass,
        ReactiveFormsModule,
        RouterLink,
        ButtonModule,
        DialogModule,
        DropdownModule,
        FileUploadModule,
        InputNumberModule,
        InputTextareaModule,
        InputTextModule,
        TooltipModule,
        ErrorMsgDirective,
        BrandModalComponent
    ],
    providers: [
        PerfumesService
    ],
    templateUrl: './form-perfume.component.html',
    styleUrl: './form-perfume.component.css'
})
export class FormPerfumeComponent implements OnInit {
    @ViewChild("fileUpload") fileUpload!: FileUpload;

    title: string = "Agregar";
    brands: Brand[] = [];
    genders: Gender[] = [];

    filesToUpload: File[] = [];
    private _imagesTotalSize: number = 0;

    get imagesTotalSize(): number {
        return this._imagesTotalSize;
    }

    files: string[] = ["https://res.cloudinary.com/dlxgdalys/image/upload/w_100,h_100/v1717305182/esencia_perfumera/perfumes/default.png"];

    allowedFileExtensions = ["jpg", "jpeg", "png", "webp", "svg"];

    descriptionMax: number = 150;

    idPerfume!: string;
    isEdit: boolean = false;

    visible: boolean = false;

    submitting: boolean = false;

    existingImages: PerfumeImage[] = [];

    formPerfume: FormGroup = this.fb.group({
        name: [,
            [
                Validators.required,
                Validators.minLength(5)
            ]
        ],
        price: [,
            [
                Validators.required,
                Validators.min(1)
            ]
        ],
        stock: [,
            [
                Validators.required,
                Validators.min(0)
            ]
        ],
        ml: [,
            [
                Validators.required,
                Validators.min(1)
            ]
        ],
        brand_id: [,
            [
                Validators.required
            ]
        ],
        gender_id: [,
            [
                Validators.required
            ]
        ],
        images: new FormControl(
            [],
            [
                this.fileValidator()
            ]
        ),
        description: [,
            [
                Validators.required,
                Validators.maxLength(this.descriptionMax)
            ]
        ]
    });

    constructor(private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router,
                private perfumesService: PerfumesService) { }

    ngOnInit() {
        this.loadBrands();
        this.loadGenders();

        if(!this.router.url.includes("editar")) return;

        this.title = "Editar";

        this.activatedRoute.params
            .pipe(
                switchMap(({ id }) => {
                    this.idPerfume = id;
                    this.isEdit = true;
                    return this.perfumesService.getPerfumeById(parseInt(id))
                })
            )
            .subscribe((perfume: Perfume) => {
                if(!perfume) {
                    console.error(`Error: No se encontró el perfume con el id: ${ this.idPerfume }`)
                    this.router.navigateByUrl("panel/inventario/perfumes");
                    return;
                }

                this.formPerfume.patchValue(perfume);
                this.existingImages = perfume.images as PerfumeImage[];
                this.loadExistingImages();
                // console.log(this.filesToUpload);
            });
    }

    async loadExistingImages() {
        for(const image of this.existingImages) {
            const file = await this.urlToFile(image.url, image.file_name);
            this.filesToUpload.push(file);
        }

        this.fileUpload.files = this.filesToUpload;
        this.fileUpload.onSelect.emit({} as FileSelectEvent);

        this.updateTotalSize();
        this.setValuesFormControlImages();
    }

    async urlToFile(url: string, fileName: string): Promise<File> {
        const response = await fetch(url);
        const blob = await response.blob();

        return new File([blob], fileName, { type: blob.type });
    }

    onBrandAdded() {
        if(this.isEdit) return;
        this.formPerfume.reset();
        this.loadBrands();
    }

    onFileSelect(event: FileSelectEvent) {
        const { files } = event;

        if(!files || files.length === 0) return;

        for(let file of files) this.filesToUpload.push(file);

        this.formPerfume.get("images")?.markAsTouched();
        if(event.currentFiles.length === 0) {
            this.clearAllFiles();
            return;
        }
        this.setValuesFormControlImages();

        // console.log(files);

        // console.log(this.formPerfume.get("images")?.errors);
        // console.log(this.formPerfume.get("images")?.valid);
    }

    onFileRemove(event: FileRemoveEvent) {
        this.filesToUpload = this.filesToUpload.filter((file) => file.name !== event.file.name);
        this.setValuesFormControlImages();
    }

    removeExistingImage(fileName: string) {
        this.existingImages = this.existingImages.filter(image => image.file_name !== fileName);
    }

    clearAllFiles() {
        this.filesToUpload = [];
        this.setValuesFormControlImages();
    }

    setValuesFormControlImages() {
        this.formPerfume.patchValue({ images: this.filesToUpload });
        this.updateTotalSize();
        this.formPerfume.get("images")?.updateValueAndValidity();
    }

    updateTotalSize() {
        const files: File[] = this.formPerfume.get("images")?.value;

        this._imagesTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    }

    loadBrands() {
        this.perfumesService.getBrands()
            .subscribe(brands => this.brands = brands);
    }

    loadGenders() {
        this.perfumesService.getGenders()
            .subscribe(genders => this.genders = genders);
    }

    save() {
        this.submitting = true;

        if (this.formPerfume.invalid) {
            Swal.fire(
                {
                    title: "Error",
                    text: "Corrija todos los errores para continuar",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                }
            )

            this.formPerfume.markAllAsTouched();
            this.submitting = false;
            return;
        }

        const perfume: Perfume = this.formPerfume.value;
        const formData = new FormData();

        for (const key in perfume) {
            if (key !== "images") {
                formData.append(key, perfume[key as keyof Perfume]!.toString());
            }
        }

        // SUPUESTAMENTE LO MISMO QUE LO DE ARRIBA (for in), PERO UN POCO MÁS LARGO
        // const perfumeEntries = Object.entries(perfume) as [keyof Perfume, any][];
        // perfumeEntries.forEach(([key, value]) => {
        //     if(key !== "images") formData.append(key, value.toString());
        // });

        if(perfume.images && Array.isArray(perfume.images)) {
            perfume.images.forEach(file => {
                if(file instanceof File) formData.append("images", file, file.name);
            })
        }

        const observableAction = this.isEdit
            ? this.perfumesService.updatePerfume(this.idPerfume, formData)
            : this.perfumesService.createPerfume(formData);

        observableAction.subscribe((res: APIPerfumeResponse) => {
            const swalOptions: SweetAlertOptions = {
                title: res.ok ? "Hecho" : "Error",
                text: res.msg,
                icon: res.ok ? "success" : "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3B82F6"
            }

            this.submitting = false;

            Swal.fire(swalOptions);

            if(res.ok && !this.isEdit) {
                this.formPerfume.reset();
                this.fileUpload.clear();
                this.clearAllFiles();
            }

            if(res.ok && this.isEdit) {
                this.existingImages = res.images;
                this.fileUpload.clear();
                this.loadExistingImages();
            }
        });

        // if(this.isEdit) {
        //     this.perfumesService.updatePerfume(this.idPerfume, formData/* perfume */)
        //         .subscribe((res: APIPerfumeResponse) => {
        //             let swalOptions: SweetAlertOptions = {
        //                 title: "Hecho",
        //                 text: res.msg,
        //                 icon: "success",
        //                 confirmButtonText: "Aceptar",
        //                 confirmButtonColor: "#3B82F6"
        //             }

        //             this.submitting = false;

        //             if(!res.ok) {
        //                 swalOptions.title = "Error";
        //                 swalOptions.icon = "error";
        //             }

        //             Swal.fire(swalOptions);
        //         });
        // } else {
        //     this.perfumesService.createPerfume(formData /* perfume */)
        //         .subscribe((res: APIPerfumeResponse) => {
        //             let swalOptions: SweetAlertOptions = {
        //                 title: "Hecho",
        //                 text: res.msg,
        //                 icon: "success",
        //                 confirmButtonText: "Aceptar",
        //                 confirmButtonColor: "#3B82F6"
        //             }

        //             this.submitting = false;

        //             if(!res.ok) {
        //                 swalOptions.title = "Error";
        //                 swalOptions.icon = "error";
        //             }

        //             Swal.fire(swalOptions);

        //             if(res.ok) {
        //                 this.clearAllFiles();
        //                 this.fileUpload.clear();
        //                 this.formPerfume.reset();
        //             }
        //         });
        // }
    }

    fileValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const files: File[] = control.value;

            if(!files || files.length === 0) return null;

            const invalidFiles = files.filter(file => {
                const extension = file.name?.split(".").pop()?.toLowerCase();

                return extension && !this.allowedFileExtensions.includes(extension);
            });

            // VALIDAR EL FORMATO DE ARCHIVO
            if(invalidFiles.length > 0) {
                return {
                    invalidExtension: {
                        allowedExtensions: this.allowedFileExtensions
                    }
                };
            }

            // VALIDAR LA CANTIDAD DE ARCHIVOS
            if(files.length > 2) {
                return {
                    maxFiles: {
                        maxLength: 2,
                        actualLength: files.length
                    }
                };
            }

            // VALIDAR EL PESO TOTAL DE LOS ARCHIVOS
            if(this._imagesTotalSize > 1 * 1024 * 1024) {
                return {
                    maxTotalSize:{
                        maxSize: 1 * 1048576,
                        actualSize: this._imagesTotalSize
                    }
                };
            }

            return null;
        }
    }

    validInput(inputName: string): boolean {
        return this.formPerfume.get(inputName)?.touched
                    ? this.formPerfume.get(inputName)?.invalid || false
                    : false;
    }

    getInputErrors(inputName: string) {
        return this.formPerfume.get(inputName)?.errors;
    }

    setInvalid(inputName: string): string {
        return this.formPerfume.get(inputName)?.touched
                    ? (this.formPerfume.get(inputName)?.invalid ? "ng-invalid ng-dirty" : "")
                    : "";
    }

    getCharactersLimitClass(): string {
        const description: string = this.formPerfume.get("description")?.value;

        if (description && description.length > this.descriptionMax) return "text-red-500 font-bold";
        else return "";
    }

    getSizeLimitClass(): string {
        if(this._imagesTotalSize > 1 * 1024 * 1024) return "text-red-500 font-bold";
        else return "";
    }

    back() {
        this.router.navigateByUrl("panel/inventario/perfumes");
    }
}
