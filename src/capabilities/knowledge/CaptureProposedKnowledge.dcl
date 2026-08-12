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

        // actually, want to return the result shape
        outcomes {
            Captured
            Rejected
        }
 

        // need rule is state if the claim is invalid (which checks all the validy rules in the shape)
        // plus need a way state that the statement needs to be a coule of words. this is not DCL think, but its a rule I cannot express in DCL. I can express it in the code that implements the capability, but not in DCL. I can express it as a rule in the capability, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint. I can express it as a rule in the shape, but not as a shape constraint.
        rules {
            StatementRequired: Claim.Statement is required

        }

        when {
            StatementRequired violated then Rejected
            otherwise then Captured
        }
    }
}