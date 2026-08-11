language dcl 1.1

context KnowledgeModel {
    depends on Shapes
    
    actor ingestAgent is agent

    capability CaptureProposedKnowledge {
        intent claim from ingestAgent

        outcomes {
            Accepted
        }

        when {
            always Accepted
        }
    }
}