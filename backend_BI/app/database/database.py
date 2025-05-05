"""
Database Configuration

Responsibilities:
- Load environment variables needed for DB connection
- Create SQLAlchemy engine and sessionmaker
- Define the declarative base for models
- Provide `get_db()` dependency for FastAPI

Intended for use across models, CRUD layers, and route dependencies.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv 
import os

# ----------------------------- Load Environment Variables -----------------------------
# Load .env variables from root-level .env file
_env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path= _env_path)

_DB_SERVER= 'DB_SERVER'
_DB_DATABASE= 'DB_DATABASE'
_DB_USERNAME= 'DB_USERNAME'
_DB_PASSWORD= 'DB_PASSWORD'
_DB_DRIVER= 'DB_DRIVER'

# Ensure all required DB connection variables are defined
_required_vars = [_DB_SERVER, _DB_DATABASE, _DB_USERNAME, _DB_PASSWORD, _DB_DRIVER]
for var in _required_vars:
    if os.getenv(var) is None:
        raise EnvironmentError(f"Missing required environment variable: {var}")

# ----------------------------- Database URL Construction -----------------------------

# Extract environment values
_server = os.getenv('DB_SERVER')
_database = os.getenv('DB_DATABASE')
_username = os.getenv('DB_USERNAME')
_password = os.getenv('DB_PASSWORD')
_driver = os.getenv('DB_DRIVER')

# Create SQLAlchemy engine (do not echo SQL for production use)
connection_url = f"mssql+pyodbc://{_username}:{_password}@{_server}/{_database}?driver={_driver.replace(' ', '+')}"

# Establishing database connection
try:
    engine = create_engine(connection_url)
    print("Database connected successfully!")
except Exception as e:
    print(f"Error connecting to the database: {e}")

# Session factory for DB interactions (used in FastAPI dependencies)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()

# ----------------------------- Dependency Function -----------------------------

def get_db():
    """
    Dependency to get a database session.

    Usage in FastAPI routes:
        db: Session = Depends(get_db)

    Yields:
        Session: a SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


