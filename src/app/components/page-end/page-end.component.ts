import {Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {PageEnterpriseComponent} from "src/app/components/page-enterprise/page-enterprise.component";
import {ArchetypeService} from "src/app/core/services/archetype.service";
import {MaterialModule} from "src/app/material.module";
import {ApiResponse} from "src/app/shared/interface/ApiResponse";
import {StringFunc} from "src/app/shared/string-utils/StringFunc";
import {ENVIRONMENT} from 'src/environments/environment';

@Component({
    selector: 'page-end',
    standalone: true,
    imports: [
        PageEnterpriseComponent,
        MaterialModule
    ],
    templateUrl: './page-end.component.html',
    styleUrl: './page-end.component.css'
})
export class PageEndComponent implements OnInit {
    private readonly _footer: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public footer: Signal<ApiResponse<string>> = this._footer.asReadonly();

    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    ngOnInit(): void {
        void this.setFooter();
    }

    private async setFooter(): Promise<void> {
        this._footer.set({payload: await this.archetypeService.getMapping(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.footer}`)});
    }
}