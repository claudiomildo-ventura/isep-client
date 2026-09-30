import {Table} from "src/app/shared/interface/Table";

export interface ArchetypeGenerate {
    autoCreated: boolean;
    architecture: string;
    databasePlatform: string;
    databaseEngineer: string;
    engineeringPlatform: string;
    template: string;
    projectTemplate: string;
    tables: Table[];
}