package com.fokam.ticket.exception;

public class BusinessRuleException extends RuntimeException {
    private final String regle;

    public BusinessRuleException(String regle, String message) {
        super(message);
        this.regle = regle;
    }

    public String getRegle() { return regle; }
}
