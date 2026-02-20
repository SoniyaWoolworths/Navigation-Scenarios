Feature: Google Navigation
  Scenario: Navigate to Google and verify title
    Given I navigate to "https://www.google.com"
    When I capture the page title
    Then the title should be "Google"
    And I take a screenshot of the page
    And I close the browser
