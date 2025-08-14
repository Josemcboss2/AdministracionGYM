import os
from playwright.sync_api import sync_playwright, expect

def run_verification(page):
    # Get the absolute path to the index.html file
    # This is necessary because the test will be run from the root of the repo
    # but the file is in the current working directory.
    file_path = os.path.abspath('index.html')
    page.goto(f'file://{file_path}')

    # 1. Add a new membership
    page.get_by_role("listitem").filter(has_text="Membresías").click()
    page.locator("#add-membership-btn").click()
    page.locator("#membershipName").fill("Gold Plan")
    page.locator("#membershipDescription").fill("Access to all areas")
    page.locator("#membershipDuration").fill("30")
    page.locator("#membershipPrice").fill("50")
    page.get_by_role("button", name="Guardar").click()

    # Take a screenshot of the memberships table
    page.screenshot(path="jules-scratch/verification/memberships.png")

    # 2. Add a new client
    page.get_by_role("listitem").filter(has_text="Clientes").click()
    page.locator("#add-client-btn").click()
    page.locator("#clientName").fill("John Doe")
    page.locator("#clientEmail").fill("john.doe@example.com")
    page.locator("#clientPhone").fill("1234567890")
    page.locator("#clientMembership").select_option(label="Gold Plan")
    page.get_by_role("button", name="Guardar").click()

    # Take a screenshot of the clients table
    expect(page.locator("#clients-table-body tr")).to_have_count(1)
    page.screenshot(path="jules-scratch/verification/clients.png")

    # 3. Verify dashboard
    page.get_by_role("listitem").filter(has_text="Dashboard").click()
    expect(page.locator("#client-count")).to_have_text("1")
    page.screenshot(path="jules-scratch/verification/dashboard.png")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    run_verification(page)
    browser.close()

print("Verification script executed successfully.")
