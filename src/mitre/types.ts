export type MitreItem = {
  id: string;
  mitreId: string;
  parentId: string;
  created: string;
  modified: string;
  name: string;
  description: string;
  source_ref: string;
  target_ref: string;
  type: ItemType;
  relationship_type: RelationshipType;
  revokedItems: MitreItem[];
  external_references: Array<ExternalReference>;
  revoked: boolean;
  x_mitre_is_subtechnique: boolean;
  x_mitre_deprecated: boolean;
  x_mitre_network_requirements: boolean;
  x_mitre_detection: string;
  x_mitre_contributors: string[];
  x_mitre_platforms: Platform[];
  x_mitre_data_sources: string[];
  kill_chain_phases: Stage[];
  x_mitre_defense_bypassed: string[];
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
  'identity' |
  'intrusion-set';

export type Platform = 'Linux' | 'maxOS' | 'Windows';

export type RelationshipType = 'uses' | 'mitigates' | 'revoked-by';

export type ExternalReference = {
  url: string;
  external_id: string;
  source_name: string;
  description: string;
};

export type MitreData = {
  objects: Array<MitreItem>;
};

export default MitreData;