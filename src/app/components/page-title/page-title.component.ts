import {UpperCasePipe} from "@angular/common";
import {Component, ElementRef, inject, OnInit, Signal, signal, ViewChild, WritableSignal} from '@angular/core';
import {ArchetypeService} from "src/app/core/services/archetype.service";
import {SessionService} from "src/app/core/services/session-storage.service";
import {MaterialModule} from "src/app/material.module";
import {ApiResponse} from "src/app/shared/interface/ApiResponse";
import {StringFunc} from "src/app/shared/string-utils/StringFunc";
import {SESSION_SERVICE} from "src/config/session-service";
import {ENVIRONMENT} from 'src/environments/environment';

@Component({
    selector: 'page-title',
    standalone: true,
    imports: [
        UpperCasePipe,
        MaterialModule
    ],
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent implements OnInit {
    private readonly _title: WritableSignal<ApiResponse<string>> = signal({payload: StringFunc.STRING_EMPTY});
    public title: Signal<ApiResponse<string>> = this._title.asReadonly();

    private readonly sessionService: SessionService = inject(SessionService);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    @ViewChild('lblTitle') lblTitle!: ElementRef<HTMLSpanElement>;

    ngOnInit(): void {
        void this.setTitle();
    }

    private async setTitle(): Promise<void> {
        this._title.set({payload: await this.archetypeService.getMapping(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.title}`)});
        this.sessionStorageInitialize();
    }

    /**
     * This function is responsible for loading the title message displayed in the modal.
     *
     */
    private sessionStorageInitialize(): void {
        this.sessionService.clear();
        this.sessionService.setItem(SESSION_SERVICE.application_title, this._title().payload);
    }
}