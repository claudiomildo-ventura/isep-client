type TechnicalLogger = Pick<Console, 'error' | 'info'>;

export const TECHNICAL_LOGGER: TechnicalLogger = console;