import { Transaction, Result } from "neo4j-driver-core";
import EntryPopulator from "../abstract/entryPopulator";

export default class PlatformPopulator extends EntryPopulator<string> {
  protected addOne(tx: Transaction, obj: string): Result {
    console.log(`Creating platform ${obj}`)
    return tx.run("CREATE (p:Platform {name: $platform})", { platform: obj })
  }
}