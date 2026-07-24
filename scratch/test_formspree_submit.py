import asyncio
from playwright.async_api import async_playwright
import os

async def test_form():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        exp_path = os.path.abspath('experience.html').replace('\\', '/')
        await page.goto("file:///" + exp_path)

        # Open modal using JS showModal or trigger if hidden
        modal = await page.query_selector('#email-modal')
        if modal:
            await page.evaluate("document.getElementById('email-modal').showModal()")

        email_input = await page.query_selector('#email-input')
        msg_input = await page.query_selector('#message-input')
        submit_btn = await page.query_selector('#form-submit-btn')

        print("Form Elements Check:")
        print("  Email input required?", await email_input.get_attribute('required') is not None)
        print("  Message input required?", await msg_input.get_attribute('required') is not None)
        print("  Status container aria-live?", await page.get_attribute('#form-status-msg', 'aria-live'))

        # Fill inputs
        await email_input.fill("test_recruiter@example.com")
        await msg_input.fill("Hello Noah, testing the contact form endpoint.")

        # Click submit and check loading state & response
        await submit_btn.click()

        # Wait a moment for fetch to complete or fail
        await page.wait_for_timeout(2000)

        status_text = await page.inner_text('#form-status-msg')
        print(f"  Submission Status Message Result: '{status_text}'")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_form())
