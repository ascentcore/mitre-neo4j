import * as yargs from 'yargs';
import Neo4jPopulater from './neo4js/populator';
import AllMitigationsByCourseOfActionReturningPlatformsQuery from './neo4js/query/allMitigationsByCourseOfActionReturningPlatforms';
import AllMitigationsOfAttackPatternQuery from './neo4js/query/allMitigationsOfAttackPattern';
import AllRelatedToAttackPattern from './neo4js/query/allRelatedToAttackPattern';
import AllRelationsOfAttackPatternQuery from './neo4js/query/allRelationsOfAttackPattern';
import AllMitigationsByCourseOfActionQuery from './neo4js/query/attMitigationsByCourseOfAction';
import IntrusionSetAttackPattern from './neo4js/query/intrusionSetAttackPattern';
import MalwareMitigation from './neo4js/query/malwareMitigation';
import Query from './neo4js/query/query';
import TopContributors from './neo4js/query/topContributors';
import Neo4jQuerier from './neo4js/queryer';

function queries(): Query[] {
  return [
    new AllMitigationsByCourseOfActionReturningPlatformsQuery('Audit'),
    new AllMitigationsOfAttackPatternQuery('AS-REP Roasting'),
    new AllRelationsOfAttackPatternQuery('AS-REP Roasting'),
    new AllMitigationsByCourseOfActionQuery('Audit'),
    new TopContributors(3),
    new AllRelatedToAttackPattern('Scripting'),
    new AllRelatedToAttackPattern('Scheduled Task'),
    new MalwareMitigation('ADVSTORESHELL'),
    new MalwareMitigation('Agent Tesla'),
    new IntrusionSetAttackPattern('APT-C-36'),
    new IntrusionSetAttackPattern('Lazarus Group'),
  ]
}

async function populate() {
  console.log('Populating database with mitre data...');
  const populater = new Neo4jPopulater()
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