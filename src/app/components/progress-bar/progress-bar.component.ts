import {CommonModule} from "@angular/common";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MaterialModule} from "src/app/material.module";
import {PROGRESS_BAR} from "src/config/progress-bar";

@Component({
    selector: 'progress-bar',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule
    ],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent implements OnInit, OnDestroy {
    public isPageLoading: boolean = true;
    public progressValue: number = 0;
    private interval?: ReturnType<typeof setInterval>;

    ngOnInit(): void {
        this.progressBarInitialize();
    }

    ngOnDestroy(): void {
        this.progressBarDestroyConfig();
    }

    private progressBarInitialize(): void {
        this.progressBarLoadConfig();
    }

    private progressBarLoadConfig(): void {
        this.interval = setInterval((): void => {
            if (this.progressValue < PROGRESS_BAR.progressMaxValue) {
                this.progressValue += PROGRESS_BAR.progressIncrementValue;
            } else {
                clearInterval(this.interval);
                this.isPageLoading = false;
            }
        }, PROGRESS_BAR.delay);
    }

    private progressBarDestroyConfig(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}