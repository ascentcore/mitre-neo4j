import * as yargs from 'yargs';
import Mitre from './mitre/mitre';
import Neo4jPopulater from './neo4j/populator';
import AllMitigationsByCourseOfActionReturningPlatformsQuery from './neo4j/query/allMitigationsByCourseOfActionReturningPlatforms';
import AllMitigationsOfAttackPatternQuery from './neo4j/query/allMitigationsOfAttackPattern';
import AllRelatedToAttackPattern from './neo4j/query/allRelatedToAttackPattern';
import AllRelationsOfAttackPatternQuery from './neo4j/query/allRelationsOfAttackPattern';
import AllMitigationsByCourseOfActionQuery from './neo4j/query/attMitigationsByCourseOfAction';
import IntrusionSetAttackPattern from './neo4j/query/intrusionSetAttackPattern';
import MalwareMitigation from './neo4j/query/malwareMitigation';
import Query from './neo4j/query/query';
import TopContributors from './neo4j/query/topContributors';
import Neo4jQuerier from './neo4j/queryer';
import AttackPatternPopulator from './neo4j/populators/node/attackPatternPopulator';
import ContributorsPopulator from './neo4j/populators/node/contributorsPopulator';
import CourseOfActionPopulator from './neo4j/populators/node/courseOfActionPopulator';
import DataComponentPopulator from './neo4j/populators/node/dataComponentPopulator';
import DataSourcePopulator from './neo4j/populators/node/dataSourcePopulator';
import IdentitiesPopulator from './neo4j/populators/node/identititesPopulator';
import IntrusionSetPopulator from './neo4j/populators/node/intrusionSetPopulator';
import MalwaresPopulator from './neo4j/populators/node/malwaresPopulator';
import EntryPopulator from './neo4j/populators/abstract/entryPopulator';
import PlatformPopulator from './neo4j/populators/node/platformPopulator';
import TechniquesPopulator from './neo4j/populators/node/techniquesPopulator';
import ToolsPopulator from './neo4j/populators/node/toolsPopulator';
import PlatformRelationPopulator from './neo4j/populators/relations/platformRelationPopulator';
import ContributorsRelationPopulator from './neo4j/populators/relations/contributorsRelationPopulator';
import RelationshipsPopulator from './neo4j/populators/relations/relationshipsPopulator';
import PermissionPoplator from './neo4j/populators/node/permissionPopulator';
import PermissionRelationPopulator from './neo4j/populators/relations/permissionRelationPopulator';
import TechniqueOrderPopulator from './neo4j/populators/relations/techniqueOrderPopulator';
import TechniqueAttackPatternRelationPopulator from './neo4j/populators/relations/techniqueAttackPatternRelationPopulator';
import AllMalwareUsedForTechnique from './neo4j/query/allMalwareUsedForTechinque';
import ShortestPath from './neo4j/query/shortestPath';
import AllPaths from './neo4j/query/allPaths';
import DataSourceRelationPopulator from './neo4j/populators/relations/dataSourceRelationPopulator';
import AllMalwareDetectedByDataSource from './neo4j/query/allMalwareDetectedByDataSource';

function populators(): EntryPopulator<any>[] {
  const mitre = new Mitre();

  return [
    new TechniquesPopulator(mitre.techniques),
    new AttackPatternPopulator(mitre.attackPatterns),
    new CourseOfActionPopulator(mitre.coursesOfAction),
    new ToolsPopulator(mitre.tools),
    new DataSourcePopulator(mitre.dataSources),
    new DataComponentPopulator(mitre.dataComponents),
    new IdentitiesPopulator(mitre.identities),
    new IntrusionSetPopulator(mitre.intrusionSets),
    new MalwaresPopulator(mitre.malwares),

    new PlatformPopulator(mitre.platforms),
    new PlatformRelationPopulator(mitre.platformRelations.map(pr => ({ source: pr.itemId, destination: pr.platform }))),

    new ContributorsPopulator(mitre.contributors),
    new ContributorsRelationPopulator(mitre.contributorRelations.map(cr => ({ source: cr.contributor, destination: cr.itemId }))),

    new PermissionPoplator(mitre.permissions),
    new PermissionRelationPopulator(mitre.permissionRelations.map(pr => ({ source: pr.itemId, destination: pr.permission }))),

    new TechniqueOrderPopulator(mitre.matrixRelations.map(mr => ({ source: mr.srcTactic, destination: mr.destTactic }))),
    new TechniqueAttackPatternRelationPopulator(mitre.techinqueAttackPatternRelations.map(tpr => ({ source: tpr.attackPattern, destination: tpr.techniqueShortName }))),

    new DataSourceRelationPopulator(mitre.dataSourceRelations.map(dsr => ({ source: dsr.itemId, destination: dsr.dataSource }))),

    new RelationshipsPopulator(mitre.relationships),
  ]
}

function queries(): Query[] {
  return [
    // new AllMitigationsOfAttackPatternQuery('AS-REP Roasting'),
    // new AllMitigationsByCourseOfActionQuery('Audit'),
    // new AllMitigationsByCourseOfActionReturningPlatformsQuery('Audit'),
    // new TopContributors(3),
    // new AllRelationsOfAttackPatternQuery('AS-REP Roasting'),
    // new AllRelatedToAttackPattern('AS-REP Roasting'),
    // new AllRelatedToAttackPattern('Scheduled Task'),
    // new MalwareMitigation('ADVSTORESHELL'),
    // new MalwareMitigation('Agent Tesla'),
    // new IntrusionSetAttackPattern('APT-C-36'),
    // new IntrusionSetAttackPattern('Lazarus Group'),
    // new AllMalwareUsedForTechnique('Credential Access'),
    // new AllMalwareUsedForTechnique('Initial Access'),
    new ShortestPath('APT-C-36', 'Impact'),
    // new ShortestPath('Lazarus Group', 'Credential Access'),
    // new ShortestPath('BlackTech', 'Credential Access'),
    // new AllPaths('BlackTech', 'Credential Access'),
    // new AllPaths('Lazarus Group', 'Credential Access'),
    // new AllMalwareDetectedByDataSource('Group'),
  ]
}

async function populate() {
  console.log('Populating database with mitre data...');
  const populater = new Neo4jPopulater(populators())
  await populater.connect()
  await populater.populate()
  await populater.disconnect()
}

async function query() {
  console.log('Running queries ...');
  const querier = new Neo4jQuerier(queries());
  await querier.run();
}

function dryRun() {
  console.log('Running dry run ...');
  const querier = new Neo4jQuerier(queries());
  querier.dryRun();
}

yargs.command(
  'populate',
  'Populate database with mitre data',
  () => null,
  () => populate(),
).command(
  'query',
  'Run sample queries',
  () => null,
  () => query(),
).command(
  'dryRun',
  'Dry run quieries',
  () => null,
  () => dryRun(),
)
.demandCommand().argv;