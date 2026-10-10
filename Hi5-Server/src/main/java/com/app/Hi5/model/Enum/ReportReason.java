package com.app.Hi5.model.Enum;

import lombok.Getter;

@Getter
public enum ReportReason {
    HARASSMENT_BULLYING("Harassment or Bullying"),
    HATE_SPEECH("Hate Speech"),
    SPAM("Spam"),
    NUDITY("Nudity or Sexual Content"),
    VIOLENCE_THREATS("Violence or Threats"),
    SELF_HARM_SUICIDE("Self-Harm or Suicide"),
    MISINFORMATION("Misinformation"),
    IMPERSONATION("Impersonation"),
    INTELLECTUAL_PROPERTY("Intellectual Property Violations"),
    INAPPROPRIATE_CONTENT("Inappropriate Content"),
    SCAMS_FRAUD("Scams or Fraud"),
    ILLEGAL_ACTIVITIES("Illegal Activities");

    private final String description;

    ReportReason(String description) {
        this.description = description;
    }
}
