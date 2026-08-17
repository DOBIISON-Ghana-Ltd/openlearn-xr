// Active version export (switch to ./config.v0, ./config.v1, etc.)
export * from "./config.v1";

// Versioned exports
export { config as configV0, type IValueMap as IValueMapV0 } from "./config.v0";
export { config as configV1, type IValueMap as IValueMapV1 } from "./config.v1";
