import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { Perfume, PerfumeResponse } from '../../../interfaces/perfumes.interfaces';
import { PerfumesService } from '../../../services/perfumes.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-perfumes',
    standalone: true,
    imports: [
        CurrencyPipe,
        FormsModule,
        RouterLink,
        ButtonModule,
        CardModule,
        InputSwitchModule,
        InputTextModule,
        ProgressSpinnerModule,
        TooltipModule,
        TableModule,
        TagModule,
    ],
    providers: [
        PerfumesService
    ],
    templateUrl: './perfumes.component.html',
    styleUrl: './perfumes.component.css'
})
export class PerfumesComponent implements OnInit {
    perfumes: PerfumeResponse[] = [];
    totalPerfumes: number = 0;
    first: number = 0;
    rows: number = 5;
    private _loading: boolean = true;

    imageSize: number = 100;

    get loading(): boolean {
        return this._loading;
    }

    constructor(private perfumesService: PerfumesService) { }

    ngOnInit() {
        this.loadPerfumes();
    }

    loadPerfumes() {
        this._loading = true;

        this.perfumesService.getPerfumes()
            .subscribe(perfumes => {
                this.perfumes = perfumes;
                this.totalPerfumes = this.perfumesService.totalPerfumes;
                this._loading = false;
            });
    }

    isEmptyPerfumes(): boolean {
        return this.perfumes.length === 0;
    }

    togglePerfumeStatus(perfume: Perfume) {
        const { id, status } = perfume;
        this.perfumesService.updatePerfumeStatus(id!, status!)
            .subscribe(ok => ok);
    }

    next() {
        if(this.isLastPage()) return;

        this.first = this.first + this.rows;
    }

    prev() {
        if(this.isFirstPage()) return;

        this.first = this.first - this.rows;
    }

    reset() {
        this.loadPerfumes();
        this.first = 0;
    }

    onPageChange(event: TableLazyLoadEvent) {
        this.first = event.first!;
        this.rows = event.rows!;
    }

    isFirstPage(): boolean {
        return this.perfumes
                ? this.first === 0
                : true;
    }

    isLastPage(): boolean {
        return this.perfumes
                ? this.first >= this.perfumes.length - this.rows
                : true;
    }

    getTagColor(idGender: number) {
        return idGender === 1
                    ? undefined
                    : (idGender === 2) ? "danger" : "secondary";
    }
}