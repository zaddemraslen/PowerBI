"""
This module centralizes the inclusion of all API route modules into the FastAPI application.

Each router is grouped under a specific tag for better organization in API documentation (e.g., Swagger UI).
"""

from fastapi import FastAPI
from app.routes import routes_production, routes_commande, routes_common, routes_equipes, routes_stock

def include_routes(app: FastAPI):
    """
    Registers all route modules with the FastAPI application.

    Each route is added with a descriptive tag for automatic grouping in the OpenAPI schema.

    - **Production**: Endpoints related to production records.
    - **Commande**: Endpoints related to customer orders (commandes).
    - **Common**: General or utility endpoints (e.g., global data deletion).

    Args:
        app (FastAPI): The FastAPI application instance.
    """
    app.include_router(routes_production.router, tags=["Production"])
    app.include_router(routes_commande.router, tags=["Commande"])
    app.include_router(routes_common.router, tags=["Common"])
    app.include_router(routes_equipes.router, tags=["Equipes"])
    app.include_router(routes_stock.router, tags=["Stocks"])