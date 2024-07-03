Feature: Lift

  Scenario: Lift
    Given the GitHub repository settings are managed by the repository-settings app
    And the scaffolder results include projectDetails
    When scaffolder results are processed
    Then properties are updated in the settings file

  Scenario: Lift w/o project details
    Given the GitHub repository settings are managed by the repository-settings app
    And the scaffolder results do not include projectDetails
    When scaffolder results are processed
    Then properties are updated in the settings file

  Scenario: Not managed with repository-settings
    Given the GitHub repository settings are not managed by the repository-settings app
    When scaffolder results are processed
    Then no updates are attempted to a settings file
