const { test, expect } = require('../../fixtures/playwright.fixtures');
const HomePage = require('../../pages/AutomationExercise/HomePage');
const ContactPage = require('../../pages/AutomationExercise/ContactPage');
const TestDataGenerator = require('../../utils/TestDataGenerator');

test.describe('Automation Exercise - Contact Us', () => {
    
    test('Navigate to Contact Us page', async ({ page }) => {
        
        // Open browser and wait for it to be ready
        await page.waitForLoadState('domcontentloaded');
        
        const homePage = new HomePage(page);
        
        // Navigate to homepage
        await homePage.openBrowser();
        await expect(page).toHaveTitle(/Automation Exercise/);
        
        // Click Contact Us
        await homePage.clickContactUs();
        
    });

    test('Verify email validation message when email is blank', async ({ page }) => {

        // Open browser and wait for it to be ready
        await page.waitForLoadState('domcontentloaded');
        
        const homePage = new HomePage(page);
        const contactPage = new ContactPage(page);

        // Navigate to Contact Us page
        await homePage.openBrowser();
        await homePage.clickContactUs();

        // Fill form with blank email
        await contactPage.fillContactForm('John Doe', '', 'Test Subject', 'This is a test message');
        await contactPage.clickSubmit();

        // Verify validation message
        await contactPage.verifyBlankEmailMessage('Vui lòng điền vào trường này.');
    });

    test('Submit Contact Us form successfully', async ({ page }) => {
        const homePage = new HomePage(page);
        const contactPage = new ContactPage(page);

        // Navigate to Contact Us page
        await homePage.openBrowser();
        await homePage.clickContactUs();

        // Generate unique data for this test run
        const uniqueName = TestDataGenerator.generateUniqueName('Kimetsu no Yaiba');
        const uniqueEmail = TestDataGenerator.generateUniqueEmail();
        const uniqueSubject = TestDataGenerator.generateUniqueSubject();
        const uniqueMessage = TestDataGenerator.generateUniqueMessage();
        
        // Fill and submit form
        await contactPage.fillContactForm(uniqueName, uniqueEmail, uniqueSubject, uniqueMessage);

        // Upload file
        await contactPage.setInputFile('test-files/images/test001.png');
        
        // Alert popup xuất hiện
        // const alertResult = await contactPage.waitForAlert('Press OK to proceed!');

        // Confirm alert
        await contactPage.acceptDialog();

        // Submit form
        await contactPage.clickSubmit();

        // Verify success message
        const successMessage = await contactPage.getSuccessMessage();
        expect(successMessage).toContain('Success! Your details have been submitted successfully.');
    });

});
