language dcl 1.1

context KnowledgeModel { 
    actor Architect is human

    capability SubmitArchitecturalClaims {
        intent claim from Architect

        outcome Accepted
        

        when {
            always  Accepted
        }
    }
}