const { test, expect } = require('../../fixtures/playwright.fixtures');
const HomePage = require('../../pages/AutomationExercise/HomePage');
const ContactPage = require('../../pages/AutomationExercise/ContactPage');
const TestDataGenerator = require('../../utils/TestDataGenerator');
const TestHelpers = require('../../utils/TestHelpers');

test('Excercise-002', async ({ page }) => {
    const homePage = new HomePage(page);
    const contactPage = new ContactPage(page);

    const fakeUser = TestHelpers.generateFakeUser();
    const uniqueName = TestDataGenerator.generateUniqueName(fakeUser.fullName);
    const uniqueEmail = TestDataGenerator.generateUniqueEmail(fakeUser.firstName, 'example.com');
    const uniqueSubject = TestDataGenerator.generateUniqueSubject();
    const uniqueMessage = TestDataGenerator.generateUniqueMessage();

    await homePage.openBrowser();
    await homePage.clickContactUs();

    await contactPage.fillContactForm(uniqueName, uniqueEmail, uniqueSubject, uniqueMessage);
    await contactPage.setInputFile('test-files/images/test001.png');
    await contactPage.acceptDialog();
    await contactPage.clickSubmit();

    expect(await contactPage.getSuccessMessage()).toContain('Success! Your details have been submitted successfully.');
});