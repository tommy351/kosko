import { Signale } from "signale";

const logger = new Signale({ disabled: true });
(logger as any).Signale = Signale;

export = logger;
