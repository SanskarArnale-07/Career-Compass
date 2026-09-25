/**
 * Canonical Career Hierarchy Types
 *
 * Defines the 4-level taxonomy:
 * DOMAIN -> PATH -> SPECIALIZATION -> ROLE
 */

export interface CareerRole {
  id: string;
  title: string;
  description?: string;
  isEntryLevel?: boolean;
  aliases?: string[];
  keywords?: string[];
}

export interface CareerSpecialization {
  id: string;
  name: string;
  description?: string;
  roles: CareerRole[];
  aliases?: string[];
  keywords?: string[];
}

export interface CareerPath {
  id: string; // Matches canonical slug, e.g. "software-development"
  slug: string;
  name: string; // Human-friendly path name, e.g. "Software Development"
  title: string; // Professional title, e.g. "Software & App Developer"
  careerName: string; // Backend scoring name, e.g. "Software / App Development"
  domainId: string;
  domainName: string;
  tagline: string;
  specializations: CareerSpecialization[];
  aliases?: string[];
  keywords?: string[];
}

export interface CareerDomain {
  id: string; // e.g. "engineering-technology"
  name: string; // e.g. "Engineering & Technology"
  description: string;
  paths: CareerPath[];
}

export interface CareerHierarchyMatch {
  domain: CareerDomain;
  path: CareerPath;
  primarySpecialization?: CareerSpecialization;
  sampleRoles: string[];
  breadcrumbs: string[];
}

export interface CareerCatalogueStats {
  totalDomains: number;
  totalPaths: number;
  totalSpecializations: number;
  totalRoles: number;
}
