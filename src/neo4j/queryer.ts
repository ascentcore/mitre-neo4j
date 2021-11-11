import * as neo4j from 'neo4j-driver';
import Query from './query/query';
import RecordPrinter from './recordPrinter';

export default class Neo4jQuerier {
  private uri: string;
  private driver: neo4j.Driver;

  constructor(private queries: Query[]) {
    this.uri = 'neo4j://localhost:7687'; 
  }

  public async run(): Promise<void> {
    await this.connect();
    for (const query of this.queries) {
      await this.runAndPrettyPrintQuery(query);
    }
    await this.disconnect();
  }

  public dryRun(): void {
    for (const query of this.queries) {
      console.log(query.className);
      console.log(query.query);
      console.log(' ');
    }
  }

  private async connect(): Promise<void> {
    this.driver = neo4j.driver(this.uri)
    try {
      await this.driver.verifyConnectivity();
      console.log('Connected to neo4j!')
    } catch (err) {
      console.error(`Failed to connect to neo4j. ${err}`)
    }
  }

  private async runQuery(query: Query): Promise<neo4j.Result> {
    const session = this.driver.session();
    console.log(`Running query ${query.query}`);
    const result = await session.readTransaction(tx => query.run(tx));
    await session.close();
    return result;
  }

  private async runAndPrettyPrintQuery(query: Query): Promise<void> {
    const result = await this.runQuery(query)
    new RecordPrinter(result.records).print();
  }

  private async disconnect(): Promise<void> {
    return this.driver.close()
  }
}