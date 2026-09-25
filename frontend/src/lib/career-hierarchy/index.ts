/**
 * Career Hierarchy Module — Public API
 * Single source of truth for the 4-level taxonomy:
 * DOMAIN -> PATH -> SPECIALIZATION -> ROLE
 */

export * from "./types";
export * from "./registry";
export * from "./search";
// searchCareerCatalogGrouped is re-exported via search above
