language dcl 1.1

context KnowledgeModel {    
    actor ingestAgent is agent

    capability CaptureProposedKnowledge {
        intent Claim from ingestAgent

        outcomes {
            Accepted
        }

        when {
            always Accepted
        }
    }
}