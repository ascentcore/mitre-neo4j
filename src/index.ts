import * as yargs from 'yargs';
import Neo4jPopulater from './neo4js/populater';
import AllMitigationsByCourseOfActionReturningPlatformsQuery from './neo4js/query/allMitigationsByCourseOfActionReturningPlatforms';
import AllMitigationsOfAttackPatternQuery from './neo4js/query/allMitigationsOfAttackPattern';
import AllRelationsOfAttackPatternQuery from './neo4js/query/allRelationsOfAttackPattern';
import AllMitigationsByCourseOfActionQuery from './neo4js/query/attMitigationsByCourseOfAction';
import Neo4jQuerier from './neo4js/queryer';

async function populate() {
  console.log('Populating database with mitre data...');
  const populater = new Neo4jPopulater()
  await populater.connect()
  await populater.populate()
  await populater.disconnect()
}

async function query() {
  console.log('Running queries ...');
  const querier = new Neo4jQuerier();
  await querier.connect()
  await querier.runQuery(new AllRelationsOfAttackPatternQuery('AS-REP Roasting'));
  await querier.runQuery(new AllMitigationsOfAttackPatternQuery('AS-REP Roasting'));
  await querier.runQuery(new AllMitigationsByCourseOfActionQuery('AS-REP Roasting'));
  await querier.runQuery(new AllMitigationsByCourseOfActionReturningPlatformsQuery('Audit'));
  await querier.disconnect();
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
)
.demandCommand().argv;