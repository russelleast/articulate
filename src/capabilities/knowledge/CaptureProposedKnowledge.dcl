language dcl 1.1

context KnowledgeModel {    
    actor architect is human
    actor discoveryAgent is agent
    actor externalSystem is system
    actor articulateStudio is system
    actor decisionAgent is agent
    actor designAgent is agent

    effect PersistClaim is persistence

    capability CaptureProposedKnowledge {
        intent Claim from architect
        intent Claim from discoveryAgent
        intent Claim from externalSystem
        intent Claim from articulateStudio
        intent Claim from decisionAgent
        intent Claim from designAgent

        outcomes {
            Captured
            Rejected
        }
 
        effects {
            PersistClaim
        }

        observe {
            capability duration as capture_proposed_knowledge_duration
            effect PersistClaim count as persist_claim_count
            outcome Rejected count as rejected_count
        }

        when {
            PersistClaim unresolved then Rejected
            otherwise then Captured
        }
    }
}