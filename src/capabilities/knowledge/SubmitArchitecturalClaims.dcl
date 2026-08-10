language dcl 1.1

context KnowledgeModel {
    depends on Shapes
 
    actor Architect is Human

    capability SubmitArchitecturalClaims {
        intent claim from Architect
    }
}