import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgForm, NgModel } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { PerfumesService } from '../../services/perfumes.service';

import { ErrorMsgDirective } from '../../directives/error-msg.directive';
import { Brand, BrandResponse } from '../../interfaces/perfumes.interfaces';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-brand-modal',
    standalone: true,
    imports: [
        FormsModule,
        NgClass,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ErrorMsgDirective
    ],
    templateUrl: './brand-modal.component.html',
    styles: ``
})
export class BrandModalComponent {
    @ViewChild("inputModel") inputModel!: NgModel;

    @Input() visible!: boolean;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() brandAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

    brandName: string = "";
    brandMinLength: number = 3;

    constructor(private perfumesService: PerfumesService) { }

    onVisibleChange() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.inputModel.reset();
    }

    save() {
        if(!this.brandName) {
            this.inputModel.control.setErrors(
                {
                    required: true
                });
        } else if(this.brandName.length < this.brandMinLength) {
            this.inputModel.control.setErrors(
                { minlength:
                    {
                        requiredLength: this.brandMinLength,
                        actualLength: this.brandName.length
                    }
                });
        }

        if(this.inputModel.invalid) {
            Swal.fire(
                {
                    title: "Error",
                    text: "El campo se encuentra vacío o no es válido",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                }
            )

            return;
        }

        const newBrand: Brand = {
            name: this.brandName
        };

        this.perfumesService.createBrand(newBrand)
            .subscribe((res: BrandResponse) => {
                let swalOptions: SweetAlertOptions = {
                    title: "Hecho",
                    text: res.msg,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3B82F6"
                }

                if(!res.ok) {
                    swalOptions.title = "Error";
                    swalOptions.icon = "error";
                }

                Swal.fire(swalOptions);

                if(res.ok) {
                    this.inputModel.reset();
                    this.visible = false;
                    this.brandAdded.emit(true);
                }
            });
    }

    setInvalid(): string {
        return this.inputModel?.touched
                    ? (this.inputModel?.invalid ? "ng-invalid ng-dirty" : "")
                    : "";
    }
}
