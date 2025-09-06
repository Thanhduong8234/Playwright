@automation-exercise @e2e
Feature: Automation Exercise Website Testing
  As a QA Engineer
  I want to test various functionalities of Automation Exercise website
  So that I can ensure the website works correctly

  Background:
    Given I navigate to "https://automationexercise.com"

  @smoke @homepage
  Scenario: Verify homepage loads correctly
    Then the page title should contain "Automation Exercise"
    And I should see the text "Features Items"
    And I should see the text "Category"

  @navigation @menu
  Scenario: Verify main navigation menu
    When I click on "Home"
    Then the page URL should contain "automationexercise.com"
    When I click on "Products"
    Then the page URL should contain "products"
    When I click on "Cart"
    Then the page URL should contain "view_cart"

  @contact @integration
  Scenario: Complete contact us workflow
    Given I navigate to the Contact Us page
    And I have generated unique test data
    When I fill the contact form with valid data:
      | name    | {generated_name}    |
      | email   | {generated_email}   |
      | subject | {generated_subject} |
      | message | {generated_message} |
    And I upload a test file "test-files/images/test001.png"
    And I click the Submit button
    And I handle the confirmation dialog
    Then I should see the success message "Success! Your details have been submitted successfully."
    When I click on "Home"
    Then the page title should contain "Automation Exercise"

  @responsive @mobile
  Scenario: Test responsive design elements
    Given I navigate to "https://automationexercise.com"
    When I take a screenshot named "desktop-view"
    # Note: In real implementation, you'd change viewport size here
    Then the element ".navbar" should be visible
    And the element ".footer" should be visible

  @performance @slow
  Scenario: Performance test - page load times
    Given I navigate to "https://automationexercise.com"
    When I wait for 2 seconds
    Then the page title should contain "Automation Exercise"
    When I click on "Products"
    And I wait for 2 seconds
    Then the page URL should contain "products"

  @data-driven @multiple-contacts
  Scenario Outline: Submit multiple contact requests
    Given I navigate to the Contact Us page
    When I fill the contact form with the following data:
      | name    | <name>    |
      | email   | <email>   |
      | subject | <subject> |
      | message | <message> |
    And I click the Submit button
    And I handle the confirmation dialog
    Then I should see the success message "Success! Your details have been submitted successfully."

    Examples:
      | name                  | email                      | subject                 | message                                    |
      | Monkey D. Luffy       | luffy@strawhat.crew        | Bug Report              | Found an issue with the navigation menu    |
      | Roronoa Zoro          | zoro@strawhat.crew         | Feature Request         | Please add search functionality            |
      | Nami                  | nami@strawhat.crew         | General Inquiry         | How to create an account?                  |
      | Usopp                 | usopp@strawhat.crew        | Technical Support       | Getting error when uploading files        |
      | Sanji                 | sanji@strawhat.crew        | Feedback                | Great website! Love the design            |
