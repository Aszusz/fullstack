Feature: Ping lifecycle

  Scenario: Record a ping and retrieve it
    When I create a ping
    Then I should see the new ping with a timestamp
    When I look up that ping
    Then I should find the same ping

  Scenario: Browse all recorded pings
    Given I have created 3 pings
    When I browse the ping history
    Then I should see all 3 pings in the list

  Scenario: Create a ping and then remove it
    When I create a ping
    And I delete that ping
    Then that ping should no longer exist
