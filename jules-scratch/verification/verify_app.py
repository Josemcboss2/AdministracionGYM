import os
from playwright.sync_api import sync_playwright, expect

def run_verification(page):
    # Navigate to the app via the local web server
    page.goto('http://localhost:8000')

    # 1. Add a new membership
    page.get_by_role("listitem").filter(has_text="Membresías").click()

    add_membership_btn = page.locator("#add-membership-btn")
    expect(add_membership_btn).to_be_visible()
    add_membership_btn.click()

    expect(page.locator("#addMembershipModal")).to_be_visible()
    page.locator("#membershipName").fill("Gold Plan")
    page.locator("#membershipDescription").fill("Access to all areas")
    page.locator("#membershipDuration").fill("30")
    page.locator("#membershipPrice").fill("50")
    page.get_by_role("button", name="Guardar").click()

    # Take a screenshot of the memberships table
    expect(page.locator("#memberships-table-body tr")).to_have_count(1)
    page.screenshot(path="jules-scratch/verification/memberships.png")

    # 2. Add a new client
    page.get_by_role("listitem").filter(has_text="Clientes").click()

    add_client_btn = page.locator("#add-client-btn")
    expect(add_client_btn).to_be_visible()
    add_client_btn.click()

    expect(page.locator("#addClientModal")).to_be_visible()
    page.locator("#clientName").fill("John Doe")
    page.locator("#clientEmail").fill("john.doe@example.com")
    page.locator("#clientPhone").fill("1234567890")

    # Wait for the membership option to be available before selecting
    expect(page.locator("#clientMembership option[value='1']")).to_be_visible()
    page.locator("#clientMembership").select_option(label="Gold Plan")

    page.get_by_role("button", name="Guardar").click()

    # Take a screenshot of the clients table
    expect(page.locator("#clients-table-body tr")).to_have_count(1)
    page.screenshot(path="jules-scratch/verification/clients.png")

    # 3. Verify dashboard
    page.get_by_role("listitem").filter(has_text="Dashboard").click()

    client_count = page.locator("#client-count")
    expect(client_count).to_be_visible()
    expect(client_count).to_have_text("1")
    page.screenshot(path="jules-scratch/verification/dashboard.png")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    run_verification(page)
    browser.close()

print("Verification script executed successfully.")
