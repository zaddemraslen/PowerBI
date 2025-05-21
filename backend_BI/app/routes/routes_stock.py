from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas import schema_stock as stockSchema
from app.crud import crud_stock as crudStock
from app.database import database

# Create an instance of APIRouter to handle routes for Stock
router = APIRouter()

# ---------------------------------- Getting
@router.get("/stocks", response_model=list[stockSchema.StockOut], summary="(READ) Get all stock records")
def read_stocks(db: Session = Depends(database.get_db)):
    """
    Retrieve all stock records from the database.

    - **db**: Database session dependency.

    Returns a list of all `Stock` records.
    """
    return crudStock.get_all_stock(db)

@router.get("/stocks/{stock_id}", response_model=stockSchema.StockOut, summary="(READ) Get stock record by id")
def read_stock(stock_id: int, db: Session = Depends(database.get_db)):
    """
    Retrieve a specific stock record by ID.

    - **stock_id**: The ID of the stock to retrieve.
    - **db**: Database session dependency.

    Raises 404 if not found.
    """
    stock = crudStock.get_stock_by_id(db, stock_id)
    if stock is None:
        raise HTTPException(status_code=404, detail=f"(READ) Stock record with ID {stock_id} was not found")
    return stock

# ------------------------------ Creation (if necessary)
# Add any creation routes here if needed, for example:
# @router.post("/stocks", response_model=stockSchema.StockOut, summary="(CREATE) Create a new stock record")
# def create_stock(stock: stockSchema.StockCreate, db: Session = Depends(database.get_db)):
#    ...

# -------------------------- Updating (if needed)
# Add update routes if applicable, for example:
# @router.put("/stock/{stock_id}", response_model=stockSchema.StockOut, summary="(UPDATE) Update a stock record")
# def update_stock(stock_id: int, stock_update: stockSchema.StockUpdate, db: Session = Depends(database.get_db)):
#    ...

# -------------------------- Deletion (if needed)
# @router.delete("/stock/{stock_id}", status_code=204, summary="(DELETE) Delete a stock record")
# def delete_stock(stock_id: int, db: Session = Depends(database.get_db)):
#    ...
