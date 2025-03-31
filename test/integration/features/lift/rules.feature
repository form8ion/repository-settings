Feature: Rules

  Scenario: No definition of classic branch protection or rulesets
    Given the GitHub repository settings are managed by the repository-settings app
    And classic branch protection is not configured
    And rulesets are not configured
    When scaffolder results are processed
    Then classic branch protection has been disabled
    And rulesets include a rule to prevent destruction of the default branch
    And rulesets include a rule to require verification to pass

  Scenario: Classic branch protection disabled and existing rulesets
    Given the GitHub repository settings are managed by the repository-settings app
    And classic branch protection is disabled
    And rulesets are configured
    When scaffolder results are processed
    Then classic branch protection has been disabled
    And existing rulesets are untouched
#    And rulesets include a rule to require verification to pass

  Scenario: existing rulesets without required checks
    Given the GitHub repository settings are managed by the repository-settings app
    And classic branch protection is disabled
    And rulesets are configured
    When scaffolder results are processed
#    Then rulesets include a rule to require verification to pass
    And existing rulesets are untouched
