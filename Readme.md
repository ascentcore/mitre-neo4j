# Neo4j Mitre Poc

This project is a graph database proof of concept using neo4j and mitre. Mitre is complex enough to test out everything
we need.

Neo4j docker: https://hub.docker.com/_/neo4j

```sh
docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --env=NEO4J_AUTH=none \
    --name neo4j \
    --rm \
    neo4j
```

Login at http://localhost:7474 with no authentication
