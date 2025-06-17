from typing import Optional, List

import requests
from fastapi import FastAPI

app = FastAPI()

API_URL = "https://www.vinted.com/api/v2/catalog/items"


def search_items(brand_id: Optional[int] = None,
                 size_id: Optional[int] = None,
                 catalog_id: Optional[int] = None) -> List[dict]:
    """Fetch newest Vinted items using optional filters."""
    params = {"page": 1, "order": "newest_first", "per_page": 20}
    if brand_id:
        params["brand_id"] = brand_id
    if size_id:
        params["size_id"] = size_id
    if catalog_id:
        params["catalog_ids[]"] = catalog_id

    response = requests.get(API_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
    return data.get("items", [])


@app.get("/search")
def search(brand_id: Optional[int] = None,
           size_id: Optional[int] = None,
           catalog_id: Optional[int] = None):
    """HTTP endpoint returning newest items."""
    items = search_items(brand_id, size_id, catalog_id)
    return {"items": items}
