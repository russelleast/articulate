language dcl 1.1

context KnowledgeModel {
    shape Claim {
        Statement: Text required
        Evidence: Evidence 
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

    shape TemporalStatus enum {
        Historical
        Current
        Emerging
        FutureIntent
        Unknown
    }

    shape Polarity enum {
        Positive
        Negative
    }

}