@contact-us @regression
Feature: Contact Us Functionality
  As a user of Automation Exercise website
  I want to be able to contact the support team
  So that I can get help or provide feedback

  Background:
    Given I am on the Automation Exercise homepage
    When I navigate to the Contact Us page

  @smoke @positive
  Scenario: Successfully navigate to Contact Us page
    Then I should see the Contact Us page title
    And I should see the contact form

  @validation @negative
  Scenario: Verify email validation when email field is blank
    When I fill the contact form with blank email:
      | name    | John Doe              |
      | email   |                       |
      | subject | Test Subject          |
      | message | This is a test message |
    And I click the Submit button
    Then I should see the email validation message "Vui lòng điền vào trường này."

  @positive @file-upload
  Scenario: Successfully submit contact form with file attachment
    Given I have generated unique test data
    When I fill the contact form with valid data:
      | name    | {generated_name}    |
      | email   | {generated_email}   |
      | subject | {generated_subject} |
      | message | {generated_message} |
    And I upload a test file "test-files/images/test001.png"
    And I click the Submit button
    And I handle the confirmation dialog
    Then I should see the success message "Success! Your details have been submitted successfully."

  @positive @data-driven
  Scenario Outline: Submit contact form with different valid data sets
    When I fill the contact form with the following data:
      | name    | <name>    |
      | email   | <email>   |
      | subject | <subject> |
      | message | <message> |
    And I click the Submit button
    And I handle the confirmation dialog
    Then I should see the success message "Success! Your details have been submitted successfully."

    Examples:
      | name              | email                    | subject           | message                    |
      | Tanjiro Kamado    | tanjiro@demonslayer.com  | Bug Report        | Found a bug in the system  |
      | Nezuko Kamado     | nezuko@demonslayer.com   | Feature Request   | Please add dark mode       |
      | Zenitsu Agatsuma  | zenitsu@demonslayer.com  | General Inquiry   | How to use this feature?   |

  @negative @validation
  Scenario Outline: Verify form validation for invalid inputs
    When I fill the contact form with invalid data:
      | name    | <name>    |
      | email   | <email>   |
      | subject | <subject> |
      | message | <message> |
    And I click the Submit button
    Then I should see validation error for "<field>" field

    Examples:
      | name    | email              | subject | message | field   |
      |         | valid@email.com    | Subject | Message | name    |
      | Name    | invalid-email      | Subject | Message | email   |
      | Name    | valid@email.com    |         | Message | subject |
      | Name    | valid@email.com    | Subject |         | message |
