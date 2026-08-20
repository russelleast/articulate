workspace {
    !identifiers hierarchical

    model {
        architect = person "Architect"
        agents = person "Agents"
        externalSystem = person "External System"

        articulate = softwareSystem "Articulate" {
            sim = container "Claim Simulator"
            
            api = container "Knowledge API" 
            db = container "Proposed Knowledge Store" {
                tags "Database"
            }

            architect -> sim
            agents -> api
            externalSystem -> api

            sim -> api
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