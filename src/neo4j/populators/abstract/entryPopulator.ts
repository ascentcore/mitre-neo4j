import * as neo4j from 'neo4j-driver';

export interface Relation {
  source: string;
  destination: string;
}

export enum EntryType {
  Node = 'NODE',
  Relation = 'RELATION',
}

export default abstract class EntryPopulator<T> {
  static createdCount = {
    [EntryType.Node]: 0,
    [EntryType.Relation]: 0,
  }

  constructor(private data: T[]) {}

  public async populate(driver: neo4j.Driver): Promise<void> {
    const session = driver.session()
    console.log(`Populating ${this.className}`)
    for (const platform of this.data) {
      const r = await session.writeTransaction(tx => this.addOne(tx, platform))
      EntryPopulator.createdCount[EntryType.Node] += r.summary.counters.updates().nodesCreated
      EntryPopulator.createdCount[EntryType.Relation] += r.summary.counters.updates().relationshipsCreated
    }
    return session.close()
  }

  public get className(): string {
    return this.constructor.name;
  }

  public printCreatedCount(): void {
    console.log('Total created: ')
    console.log(`Created ${EntryType.Node}: ${EntryPopulator.createdCount[EntryType.Node]}`)
    console.log(`Created ${EntryType.Relation}: ${EntryPopulator.createdCount[EntryType.Relation]}`)
    console.log()
  }

  protected abstract addOne(tx: neo4j.Transaction, obj: T): Promise<neo4j.QueryResult>;
}