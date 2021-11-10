import { QueryResult, Transaction } from "neo4j-driver";
import EntryPopulator from "../abstract/entryPopulator";

export default class PermissionPoplator extends EntryPopulator<string> {
    protected addOne(tx: Transaction, obj: string): Promise<QueryResult> {
      return tx.run(
        "CREATE (p:Permission {id: $name, name: $name})",
        { 
          id: obj,
          name: obj 
        },
      )
    }
} 