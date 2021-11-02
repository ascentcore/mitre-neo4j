import * as yargs from 'yargs';
import Neo4jPopulater from './neo4js/populater';

async function populate() {
  console.log('Populating database with mitre data...');
  const populater = new Neo4jPopulater()
  await populater.connect()
  await populater.populate()
  await populater.disconnect()
}

yargs.command(
  'populate',
  'Populate database with mitre data',
  () => null,
  () => populate(),
).demandCommand().argv;