import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, of, pipe } from 'rxjs';

import { environment } from '../../../../environments/environment.prod';
// import { environment } from '../../../../environments/environment';

import {
    APIPerfumeResponse,
    Brand,
    BrandResponse,
    Gender,
    GenderResponse,
    Perfume,
    PerfumeResponse
} from '../interfaces/perfumes.interfaces';

@Injectable()
export class PerfumesService {
    private _perfumes: Perfume[] = [];
    private _totalPerfumes: number = 0;

    // get perfumes():

    get totalPerfumes(): number {
        return this._totalPerfumes;
    }

    constructor(private http: HttpClient) { }

    public getPerfumes(): Observable<PerfumeResponse[]> {
        const url: string = `${environment.BASE_URL}/perfumes`;

        return this.http.get<APIPerfumeResponse>(url)
                    .pipe(
                        map((res: APIPerfumeResponse) => res.perfumes!),
                        catchError(() => of([]))
                    );
    }

    public getPerfumeById(id: number): Observable<Perfume> {
        const url: string = `${environment.BASE_URL}/perfumes/${id}`;

        return this.http.get<APIPerfumeResponse>(url)
                    .pipe(
                        map((res: APIPerfumeResponse) => {
                            let { perfume } = res;

                            const formattedPerfume = perfume && {
                                ...perfume,
                                brand_id: perfume.brand!.id,
                                gender_id: perfume.gender!.id
                            };

                            delete formattedPerfume?.brand;
                            delete formattedPerfume?.gender;

                            return (formattedPerfume as Perfume);

                            // const {
                            //     name,
                            //     description,
                            //     price,
                            //     stock,
                            //     ml,
                            //     brand: { id: brand_id },
                            //     gender: { id: gender_id },
                            //     images
                            // } = perfume!;

                            // return {
                            //     name,
                            //     description,
                            //     price,
                            //     stock,
                            //     ml,
                            //     brand_id: brand_id!,
                            //     gender_id,
                            //     images
                            // };
                        }),
                        catchError(() => of({} as Perfume))
                    );
    }

    public createPerfume(perfumeData: FormData): Observable<APIPerfumeResponse> {
        const url: string = `${environment.BASE_URL}/perfumes`;

        return this.http.post<APIPerfumeResponse>(url, perfumeData)
                    .pipe(
                        map((res: APIPerfumeResponse) => res),
                        catchError(({ error }) => of(error))
                    );
    }

    public updatePerfume(idPerfume: string, perfumeData: FormData): Observable<APIPerfumeResponse> {
        const url: string = `${environment.BASE_URL}/perfumes/${idPerfume}`;

        return this.http.put<APIPerfumeResponse>(url, perfumeData)
                    .pipe(
                        map((res: APIPerfumeResponse) => res),
                        catchError(({ error }) => of(error))
                    )
    }

    public updatePerfumeStatus(idPerfume: number, newStatus: boolean): Observable<boolean> {
        const url: string = `${environment.BASE_URL}/perfumes/status/${idPerfume}`;

        return this.http.put<Boolean>(url, { status: newStatus })
                    .pipe(
                        map((res: any) => res.ok),
                        catchError((err) => of(false))
                    );
    }

    public getBrands(): Observable<Brand[]> {
        const url: string = `${environment.BASE_URL}/brands`;

        return this.http.get<BrandResponse>(url)
                    .pipe(
                        map((res: BrandResponse) => res.brands!),
                        catchError(() => of([]))
                    );
    }

    public createBrand(brand: Brand): Observable<BrandResponse> {
        const url: string = `${environment.BASE_URL}/brands`;

        return this.http.post<BrandResponse>(url, brand)
                    .pipe(
                        map((res: BrandResponse) => res),
                        catchError(({ error }) => of(error))
                    )
    }

    public getGenders(): Observable<Gender[]> {
        const url: string = `${environment.BASE_URL}/genders`;

        return this.http.get<GenderResponse>(url)
                    .pipe(
                        map((res: GenderResponse) => res.genders!),
                        catchError(() => of([]))
                    );
    }
}
