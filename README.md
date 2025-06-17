# Vinted Bot

This repository contains a simple example of a Vinted bot. It exposes a
small FastAPI application that can fetch the latest Vinted listings using
optional filters for brand, size and category.

## Setup

Install dependencies and run the server:

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

You can then open `/search?brand_id=<id>&size_id=<id>&catalog_id=<id>` to
see the most recent items matching those filters.

For quick testing you can also run `python poll.py` which polls the API
every second and prints item titles.
