import time
from typing import Optional

from app import search_items


def poll(brand_id: Optional[int] = None,
         size_id: Optional[int] = None,
         catalog_id: Optional[int] = None,
         interval: float = 1.0):
    """Poll Vinted for new items every `interval` seconds."""
    while True:
        try:
            items = search_items(brand_id, size_id, catalog_id)
            print("Fetched", len(items), "items")
            for item in items:
                print(item.get("title"))
        except Exception as exc:
            print("Error during fetch:", exc)
        time.sleep(interval)


if __name__ == "__main__":
    poll()
