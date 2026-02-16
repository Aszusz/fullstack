Feature: Ping lifecycle

  Scenario: Record a ping and see it in the list
    Given I am on the ping page
    When I add a ping
    Then I should see the new ping in the list

  Scenario: Browse recorded pings
    Given I am on the ping page
    When I add 3 pings
    Then I should see 3 pings in the list

  Scenario: Remove a ping
    Given I am on the ping page
    And I add a ping
    When I delete the last ping
    Then that ping should be gone from the list
