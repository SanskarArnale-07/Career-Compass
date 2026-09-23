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
}

export interface CareerSpecialization {
  id: string;
  name: string;
  description?: string;
  roles: CareerRole[];
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
