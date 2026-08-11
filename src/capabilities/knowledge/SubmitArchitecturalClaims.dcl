language dcl 1.1

context KnowledgeModel { 
    actor Architect is human

    capability SubmitArchitecturalClaims {
        intent Claim from Architect

        outcome Accepted
        

        when {
            always  Accepted
        }
    }
}