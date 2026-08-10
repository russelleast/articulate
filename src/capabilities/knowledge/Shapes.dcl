language dcl 1.1

context KnowledgeModel {
    shape Claim{
        Statement: Text required
        Evedence: Evidence 
        Provenance: Provenance required
        TemporalStatus: TemporalStatus required
        Polarity: Polarity required
        Confidence: Number required min 0 max 1
    }
    
    shape Evidence {
        Value: Text required
    }

    shape Provenance{
        Source: Text required

    }

    shape TemporalStatus {
        Value: Text required
    }

    shape Polarity enum {
        Positive
        Negative
    }


}