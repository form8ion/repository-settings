Feature: Rules

  Scenario: No definition of classic branch protection or rulesets
    Given the GitHub repository settings are managed by the repository-settings app
    And classic branch protection is not configured
    And rulesets are not configured
    When scaffolder results are processed
    Then classic branch protection is disabled
    And rulesets include a rule to prevent destruction of the default branch
