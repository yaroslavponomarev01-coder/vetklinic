from playwright.sync_api import sync_playwright
import time
import os

def run():
    os.makedirs('/home/jules/verification/screenshots', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto("http://localhost:8000")

        # Scroll to services
        page.evaluate("document.querySelector('.services-grid').scrollIntoView()")
        time.sleep(1) # wait for AOS animations

        # Take screenshot before hover
        page.screenshot(path='/home/jules/verification/screenshots/services-normal.png')

        # Hover over the first service card
        page.hover('.service-card')
        time.sleep(0.5) # wait for CSS transitions

        # Take screenshot after hover
        page.screenshot(path='/home/jules/verification/screenshots/services-hover.png')

        browser.close()

if __name__ == '__main__':
    run()
