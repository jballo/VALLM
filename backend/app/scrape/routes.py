from flask import jsonify, request, make_response
from app.scrape import bp
from app.utils import verify_auth_header
from app.extensions import scraper
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from app.config import Config
import pprint


AUTH = Config.BRIGHT_DATA_AUTH
SBR_WS_CDP = Config.SBR_SW_CDP

@bp.route("/pw", methods=['POST'])
def pw_scrape_url():
    # Verify the request is authenticated
    header_api_key = request.headers.get('X-API-Key')
    auth_check = verify_auth_header(header_api_key)
    if auth_check != None:
        return auth_check
    
    url_param = request.args.get('url')
    print("Attempting to scrape: ", url_param)

    print('Connecting to Scraping Browser...')
    with sync_playwright() as playwright:
        # run(pw=playwright, url=url_param)
        print('Connecting to Scraping Browser...')
        browser = playwright.chromium.connect_over_cdp(SBR_WS_CDP)
        try:
            page = browser.new_page()
            print('Connected! Navigating to webpage')
            page.goto(url_param, wait_until="domcontentloaded", timeout=60000)

            html = page.content()
            soup = BeautifulSoup(html)
            content = soup.prettify()
            content_text = soup.get_text()
            print("\n\n\n\n-------------TEXT-------------\n\n\n\n")
            print(content_text)
            print("\n\n\n\n--------------------------------\n\n\n\n")

            response_body = {
                "status": "success",
                "code": 200,
                "content": content_text
            }

            return make_response(jsonify(response_body), 200)
        except Exception as error:
            print("Error: ", str(error))
            response_body = {
                "status": "failure",
                "code": 500,
                "error": str(error)
            }
            return make_response(jsonify(response_body), 500)
        finally:
            browser.close()


@bp.route("", methods=["POST"])
def scrape_url():
    header_api_key = request.headers.get('X-API-Key')
    auth_check = verify_auth_header(header_api_key)
    if auth_check != None:
        return auth_check
    
    url_param = request.args.get('url')
    print("Attempting to scrape: ", url_param)
    try:

        url_param = request.args.get('url')
        print("Attempting to scrape: ", url_param)
        scrape_response = scraper.scrape_url(
            url_param, 
            formats=['markdown']
        )
        # print(scrape_status)
        # pprint.pprint(scrape_response)
        print("markdown: ", scrape_response.markdown)
        response_body = {
            "status": "success",
            "content": scrape_response.markdown
        }
        return make_response(jsonify(response_body), 200)
    except Exception as error:
        print("Error: ", str(error))
        response_body = {
            "status": "failure",
            "code": 500,
            "error": str(error)
        }
        return make_response(jsonify(response_body), 500)
