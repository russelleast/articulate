language dcl 1.1

context KnowledgeModel { 
    actor ProposedClaimSubscriber is system // this is a subscriber to a queue

    shape ReviewStatus enum {
        Ready
        NotReady
    }

    shape ReviewProposedClaimResult {
        ClaimId: Uuid required
        Status: ReviewStatus required
        Confidence: Number required min 0 max 1
    }

    effect RecordReviewResult is tool

    event ClaimAnalysed is ReviewProposedClaimResult
    event ReceivedClaim is Claim

    policy MinimumAnswerConfidence {
        confidence {
            threshold 0.6
        }
    }

    policy AuditRecordReviewResult {
        governance {
            audit required
            evidence required
        }
    }

    capability ReviewProposedClaim {
        intent Claim from ProposedClaimSubscriber

        outcomes {
            Ready is ReviewProposedClaimResult
            NotReady is ReviewProposedClaimResult
            Failed
        }

        effects {
            RecordReviewResult
        }

        policies {
            MinimumAnswerConfidence governs outcome NotReady
            AuditRecordReviewResult governs effect RecordReviewResult
        }

        observe {
            capability duration as review_proposed_claim_duration
            outcome Failed count as failed_count
            outcome Ready count as ready_count
            outcome NotReady count as not_ready_count
        }

        when {
            RecordReviewResult unresolved then Failed
            policy MinimumAnswerConfidence fails then NotReady
            otherwise then Ready
        }

        lifecycle {
            begin Received
            step AnalysingClaim
            step RecordingResult
            end Completed

            move Received to AnalysingClaim on event ReceivedClaim
            move AnalysingClaim to RecordingResult on event ClaimAnalysed
            move RecordingResult to Completed on outcome Ready
            move RecordingResult to Completed on outcome NotReady
            move RecordingResult to Completed on outcome Failed
        }
    }
}