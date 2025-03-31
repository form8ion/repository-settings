Feature: Lift

  Scenario: Lift
    Given the GitHub repository settings are managed by the repository-settings app
    And the scaffolder results include homepage
    And the scaffolder results include tags
    When scaffolder results are processed
    Then repository details are updated in the settings file

  Scenario: Lift w/o project details
    Given the GitHub repository settings are managed by the repository-settings app
    And the scaffolder results include tags
    But the scaffolder results do not include homepage
    When scaffolder results are processed
    Then repository details are updated in the settings file

  Scenario: Lift w/o tags
    Given the GitHub repository settings are managed by the repository-settings app
    And the scaffolder results include homepage
    But the scaffolder results do not include tags
    When scaffolder results are processed
    Then repository details are updated in the settings file

  Scenario: Lift w/ existing tags and new tags
    Given the GitHub repository settings are managed by the repository-settings app
    And the existing settings file includes existing tags
    And the scaffolder results include homepage
    And the scaffolder results include tags
    When scaffolder results are processed
    Then repository details are updated in the settings file

  Scenario: Not managed with repository-settings
    Given the GitHub repository settings are not managed by the repository-settings app
    When scaffolder results are processed
    Then no updates are attempted to a settings file

  @wip
  Scenario: convert `private` boolean to visibility
