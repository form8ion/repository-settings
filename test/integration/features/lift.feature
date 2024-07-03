Feature: Lift

  Scenario: Lift
    Given the GitHub repository settings are managed by the repository-settings app
    When scaffolder results are processed
    Then properties are updated in the settings file

  Scenario: Not managed with repository-settings
    Given the GitHub repository settings are not managed by the repository-settings app
    When scaffolder results are processed
    Then no updates are attempted to a settings file
