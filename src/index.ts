import * as yargs from 'yargs';
import Neo4jPopulater from './neo4js/populator';
import AllMitigationsByCourseOfActionReturningPlatformsQuery from './neo4js/query/allMitigationsByCourseOfActionReturningPlatforms';
import AllMitigationsOfAttackPatternQuery from './neo4js/query/allMitigationsOfAttackPattern';
import AllRelationsOfAttackPatternQuery from './neo4js/query/allRelationsOfAttackPattern';
import AllMitigationsByCourseOfActionQuery from './neo4js/query/attMitigationsByCourseOfAction';
import Query from './neo4js/query/query';
import Neo4jQuerier from './neo4js/queryer';

function queries(): Query[] {
  return [
    new AllMitigationsByCourseOfActionReturningPlatformsQuery('Audit'),
    new AllMitigationsOfAttackPatternQuery('AS-REP Roasting'),
    new AllRelationsOfAttackPatternQuery('AS-REP Roasting'),
    new AllMitigationsByCourseOfActionQuery('Audit'),
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