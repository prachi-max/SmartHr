import requests
from bs4 import BeautifulSoup
import re

def scrape_job_url(url: str) -> dict:
    result = {"company": "", "role": "", "job_description": "", "job_url": url}
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        resp = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")

        # Try to extract title (role)
        title_tag = soup.find("title")
        if title_tag:
            title = title_tag.text.strip()
            result["role"] = title.split("|")[0].split("-")[0].strip()[:200]

        # Try to get meta description or main content
        meta_desc = soup.find("meta", {"name": "description"})
        if meta_desc:
            result["job_description"] = meta_desc.get("content", "")[:2000]

        # Try common job site selectors
        for selector in ["[class*='job-description']", "[class*='description']", "[class*='job-details']", "main", "article"]:
            elem = soup.select_one(selector)
            if elem and len(elem.get_text(strip=True)) > 200:
                result["job_description"] = elem.get_text(separator="\n", strip=True)[:3000]
                break

        # Try to extract company name
        og_site = soup.find("meta", {"property": "og:site_name"})
        if og_site:
            result["company"] = og_site.get("content", "")

    except Exception as e:
        result["error"] = f"Could not scrape: {str(e)}"

    return result
