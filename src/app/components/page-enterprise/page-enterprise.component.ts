import {Component, ElementRef, inject, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {ArchetypeService} from "src/app/core/services/archetype.service";
import {MaterialModule} from "src/app/material.module";
import {ApiResponse} from "src/app/shared/interface/ApiResponse";
import {StringFunc} from "src/app/shared/string-utils/StringFunc";
import {ENVIRONMENT} from "src/environments/environment";

@Component({
    selector: 'page-enterprise',
    standalone: true,
    imports: [
        MaterialModule
    ],
    templateUrl: './page-enterprise.component.html',
    styleUrl: './page-enterprise.component.css'
})
export class PageEnterpriseComponent implements OnInit {
    private readonly _enterprise: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public enterprise: Signal<ApiResponse<string>> = this._enterprise.asReadonly();

    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    @ViewChild('lblEnterprise') lblEnterprise!: ElementRef<HTMLParagraphElement>;

    ngOnInit(): void {
        void this.setEnterprise();
    }

    private async setEnterprise(): Promise<void> {
        this._enterprise.set({payload: await this.archetypeService.getMapping(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.enterprise}`)});
    }
}