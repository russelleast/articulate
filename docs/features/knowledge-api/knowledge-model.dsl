workspace {
    !identifiers hierarchical

    model {
        architect = person "Architect"
        ingest = person "Ingest Agent"

        articulate = softwareSystem "Articulate" {
            sim = container "Claim Simulator"            

            api = container "Knowledge API" 
            db = container "Knowledge Model" {
                tags "Database"
            }

            ingest -> sim
            sim -> api
            ingest -> api
            api -> db
        }     
        
    }

    views {
        systemContext articulate {
            include *
            autolayout lr
        }

        container articulate {
            include *
            autolayout lr
        }

        styles {
            
            element "Person" {
                shape person
            }
            element "Database" {
                shape cylinder
            }

        }
    }
}