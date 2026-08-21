workspace {
    !identifiers hierarchical

    model {
        architect = person "Architect"
        agents = person "Agents"
        externalSystem = person "External System"

        articulate = softwareSystem "Articulate" {
            sim = container "Claim Simulator" {
                description "Development tool for submitting architectural claims into the Knowledge API."
            }

            api = container "Knowledge API" {
                description "Boundary for capturing and evolving proposed architectural knowledge."
            }

            proposedKnowledge = container "Proposed Knowledge Store" {
                description "Durable storage for staged architectural claims and their review evidence."
                tags "Database"
            }

            rabbitmq = container "RabbitMQ" {
                description "Message broker used by Dapr Pub/Sub to distribute proposed-knowledge events."
            }

            reviewAgent = container "Review Proposed Claim Agent" {
                description "Specialised reasoning agent that reviews whether a proposed claim is ready for further knowledge evolution."
            }

            redis = container "Agent State Store" {
                description "Stores execution markers used by the review agent."
                tags "Database"
            }

            ollama = container "Ollama / Gemma 3" {
                description "Local language model used by the review agent through Dapr Conversation."
            }

            architect -> sim "Submits test scenarios"

            sim -> api "Submits architectural claims" "gRPC"
            
            agents -> api
            externalSystem -> api

            api -> proposedKnowledge "Persists proposed claims"

            api -> rabbitmq "Publishes proposed-knowledge events" "Dapr Pub/Sub"

            rabbitmq -> reviewAgent "Delivers proposed claims" "Dapr Pub/Sub"

            reviewAgent -> ollama "Reviews proposed claims" "Dapr Conversation"

            reviewAgent -> redis "Reads and writes execution markers" "Dapr State"

            reviewAgent -> proposedKnowledge "Records review result" "Knowledge API internal repository boundary"
        }

    }

    views {


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