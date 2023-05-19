Feature: Login for Codere

    Background: Given am I an already existing user

    Scenario Outline: I can validate the login in Codere's page
        When I tap the login button in the home page
        And I put <email_status> email and <password_status> password
        Then I verify I <action> log into my personal area

            | email_status | password_status | action |
            | a valid      | a valid         | can    |
            | an invalid   | a valid         | can't  |
            | a valid      | an invalid      | can't  |
            | an invalid   | an invalid      | can't  |
            | no           | no              | can't  |

    Scenario: I can validate the logout in Codere's page
        When I am on my personal area
        And I tap the logout button
        Then I verify I am properly logged out