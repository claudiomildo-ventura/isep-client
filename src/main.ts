/**
 {*******************************************************************************}
 {                                                                               }
 {                          Unified Development Platform                         }
 {                                                                               }
 { Copyright(c) 2020-2025 CV IT Consulting and Services - Claudiomildo Ventura   }
 {                                                                               }
 {*******************************************************************************}
 */

import {AppComponent} from './app/app.component';
import {bootstrapApplication} from '@angular/platform-browser';
import {APP_CONFIG} from './app/app.config';
import {TECHNICAL_LOGGER} from "./config/technical-logger";

bootstrapApplication(AppComponent, APP_CONFIG)
    .then(r => TECHNICAL_LOGGER.info('running application'))
    .catch(ex => TECHNICAL_LOGGER.error('Error during application bootstrap:', ex));