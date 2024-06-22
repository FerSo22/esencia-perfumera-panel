import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[errorMsg]',
    standalone: true
})
export class ErrorMsgDirective implements OnInit {
    htmlElement: ElementRef<HTMLElement>;
    private _msg: string = "";
    private _color: string = "#FF0000";
    // private _isValid: boolean = true;
    private _errors: any = {};

    private errorMessages: { [key: string]: string | ((params: any) => string) } = {
        required: "Este campo es obligatorio",
        minlength: ({ requiredLength }) => `El texto es muy corto (mín. ${ requiredLength } caracteres)`,
        maxlength: ({ requiredLength }) => `El texto es muy largo (máx. ${ requiredLength } caracteres)`,
        min: ({ min }) => `El valor mínimo es ${ min }`,
        max: ({ max }) => `El valor mínimo es ${ max }`,
        maxTotalSize: ({ maxSize }) => `El peso no debe exceder los ${ maxSize / 1024 / 1024 }MB entre ambos archivos`,
        maxFiles: ({ maxLength }) => `La cantidad de archivos no debe ser mayor a ${ maxLength }`,
        invalidExtension: ({ allowedExtensions }) => `Se encontró uno o más archivos con una extensión no permitida \n(Permitidas: ${allowedExtensions.join(", ")})`
    };

    @Input() set msg(value: string) {
        // this.htmlElement.nativeElement.innerText = value;
        this._msg = value;
        this.setMsg();
    }

    @Input() set isValid(value: boolean) {
        // this._isValid = value;
        if (value) {
            this.htmlElement.nativeElement.classList.add("hidden");
        } else {
            this.htmlElement.nativeElement.classList.remove("hidden");
        }
    }

    @Input() set errors(value: any) {
        this._errors = value;
        // console.log(value);
        this.setMsg();
    }

    constructor(private el: ElementRef<HTMLElement>) {
        this.htmlElement = el;
    }

    ngOnInit(): void {
        this.setColor();
        this.setMsg();
    }

    setMsg(): void {
        if(this._msg.length > 0) {
            this.htmlElement.nativeElement.innerText = this._msg;
            return;
        }

        if(!this._errors || Object.keys(this._errors).length === 0) return;

        const firstErrorKey = Object.keys(this._errors)[0];
        const errorParams = this._errors[firstErrorKey];
        const errorMessageTemplate = this.errorMessages[firstErrorKey];

        const errorMessage = typeof errorMessageTemplate === 'function'
                                ? errorMessageTemplate(errorParams)
                                : errorMessageTemplate;

        this.htmlElement.nativeElement.innerText = errorMessage;
        // this.htmlElement.nativeElement.innerText = this._msg;
    }

    setColor(): void {
        this.htmlElement.nativeElement.style.color = this._color;
    }
}
