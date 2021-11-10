export type MitreItem = {
  id: string;
  parentId: string;
  created: string;
  modified: string;
  name: string;
  description: string;
  source_ref: string;
  target_ref: string;
  type: ItemType;
  relationship_type: string;
  external_references: Array<ExternalReference>;
  x_mitre_is_subtechnique: boolean;
  x_mitre_deprecated: boolean;
  x_mitre_network_requirements: boolean;
  x_mitre_permissions_required: string[];
  x_mitre_detection: string;
  x_mitre_contributors: string[];
  x_mitre_platforms: string[];
  x_mitre_data_sources: string[];
  x_mitre_data_source_ref: string;
  kill_chain_phases: Stage[];
  x_mitre_defense_bypassed: string[];
  tactic_refs: string[];
  revoked: boolean;
};

export type Stage = {
  kill_chain_name: string;
  phase_name: string;
};

export type ItemType = 'relationship' | 
  'attack-pattern' | 
  'x-mitre-tactic' | 
  'tool' |
  'malware' | 
  'course-of-action' | 
  'x-mitre-data-source' |
  'x-mitre-data-component' |
  'x-mitre-matrix' |
  'identity' |
  'intrusion-set';

export type ExternalReference = {
  url: string;
  external_id: string;
  source_name: string;
  description: string;
};

export type MitreJson = {
  objects: Array<MitreItem>;
};

export default MitreJson;