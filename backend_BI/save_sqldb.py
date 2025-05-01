"""
this script upload command eand production data into the sql database
It considers the fk constraint
make sure to run this script when both tables do not exist
"""

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy import Integer
from sqlalchemy import inspect
from tabulate import tabulate

# Paramètres de connexion SQL Server
server = r'localhost\SQLEXPRESS'
database = 'MatisAeroDB'
username = 'almaa'
password = '123456'

fichier_excel = 'Matis_Aerospace_Complet.xlsx'

# Force ID_Commande to int in both DataFrames
#df_commande['ID_Commande'] = df_commande['ID_Commande'].astype(int)
#df_production['ID_Commande'] = df_production['ID_Commande'].astype(int)

# Créer l'URL de connexion SQLAlchemy
connection_string = (
    f"mssql+pyodbc://{username}:{password}@{server}/{database}"
    "?driver=ODBC+Driver+17+for+SQL+Server"
)

# Création de l'engine SQLAlchemy
engine = create_engine(connection_string)

# Check if the table already exists
inspector = inspect(engine)

excel_file = pd.ExcelFile(fichier_excel)

# Lecture des feuilles: Commande et Production
df_commande = excel_file.parse('Commande')
df_production = excel_file.parse('Production')

# Keep only productions that have a valid commande
valid_ids = set(df_commande['ID_Commande'])
df_production = df_production[df_production['ID_Commande'].isin(valid_ids)]

# Clean quantity and ID fields
#df_production["ID_Production"] = df_production["ID_Production"].astype(int)
#df_production["ID_Commande"] = df_production["ID_Commande"].astype(int)
#df_production["Quantité"] = df_production["Quantité"].round().astype(int)
#df_production["Temps_Production"] = df_production["Temps_Production"].round().astype(int)
#df_commande["ID_Commande"] = df_commande["ID_Commande"].astype(int)
#df_commande["Quantité"] = df_commande["Quantité"].round().astype(int)

# Verify SQL connection before proceeding
try:
    with engine.connect() as connection:
        # Try to execute a simple query (e.g., querying the list of tables)
        result = connection.execute(text("SELECT 1"))
        print("Connexion à la base de données SQL Server réussie.")
except OperationalError as e:
    print(f"Erreur de connexion: {e}")

# Insertion dans l'ordre correct avec verification de l'existance (drop si c'est le cas)
with engine.begin() as connection: #begin()=> auto-comit if success

    # 0. drop table if exist
    if 'Production' in inspector.get_table_names():
        connection.execute(text("DROP TABLE Production"))
        print("Table 'Production' dropped.")

    if 'Commande' in inspector.get_table_names():
        connection.execute(text("DROP TABLE Commande"))
        print("Table 'Commande' dropped.")



    # 1. Insérer les commandes d'abord (table "Commande")
    # 1.1 Manually create the table with IDENTITY
    connection.execute(text("""
    CREATE TABLE Commande (
        ID_Commande INT IDENTITY(1,1),
        Client NVARCHAR(255),
        Date_Commande DATE,
        Produit_Commandé NVARCHAR(255),
        Quantité INT,
        Statut NVARCHAR(255)
    )
    """))
    connection.execute(text("SET IDENTITY_INSERT Commande ON"))
    df_commande.to_sql('Commande', con=connection, if_exists='append', index=False,
                       dtype={'ID_Commande': Integer(),
                              'Quantité': Integer()})
    connection.execute(text("SET IDENTITY_INSERT Commande OFF"))
    print(" Données insérées dans la table 'Connection' avec succès")

    connection.execute(text("""
    ALTER TABLE Commande
    ALTER COLUMN ID_Commande INT NOT NULL
    """))

    # Add PRIMARY KEY on Commande
    connection.execute(text("""
        ALTER TABLE Commande
        ADD CONSTRAINT pk_commande PRIMARY KEY (ID_Commande)
    """))
    print("Primary key constraint on Commande created.")

    # 2. Puis insérer les productions (table "Production)")
    # 2.1 Manually create the table with IDENTITY
    connection.execute(text("""
        CREATE TABLE Production (
            ID_Production INT IDENTITY(1,1),
            Date_Production DATE,
            Produit NVARCHAR(255),
            Quantité INT,
            Statut NVARCHAR(255),
            Prix_Unitaire FLOAT,
            Coût_Production FLOAT,
            Temps_Production FLOAT,
            ID_Commande INT
        )
    """))
    connection.execute(text("SET IDENTITY_INSERT Production ON"))
    df_production.to_sql('Production', con= connection, if_exists='append', index=False,
                         dtype={'ID_Commande': Integer(),
                                'ID_Production': Integer(),
                                'ID_Commande': Integer(),
                                'Quantité': Integer(),
                                'Temps_Production': Integer()})
    connection.execute(text("SET IDENTITY_INSERT Production OFF"))
    print(" Données insérées dans la table 'Production' avec succès")

    connection.execute(text("""
    ALTER TABLE Production
    ALTER COLUMN ID_Production INT NOT NULL
    """))

    # Add PRIMARY KEY on Commande
    connection.execute(text("""
        ALTER TABLE Production
        ADD CONSTRAINT pk_production PRIMARY KEY (ID_Production)
    """))
    print("Primary key constraint on Production created.")


    # 3. Add the foreign key constraint
    connection.execute(text("""
        ALTER TABLE Production
        ADD CONSTRAINT fk_production_commande
        FOREIGN KEY (ID_Commande)
        REFERENCES Commande(ID_Commande)
    """))
    print(" Foreign key constraint created.")

    # 4. Fetch productions
    result_prod = connection.execute(text("SELECT TOP 5 * FROM Production"))
    productions = result_prod.fetchall()
    print("\n=== Productions (TOP 5) ===")
    production_columns= list(result_prod.keys())
    prod_row_list=[]
    for row in productions:
        prod_row_list.append(list(row))
    print(tabulate(prod_row_list, headers=production_columns, tablefmt='pretty'))

    # 5. Fetch corresponding commandes for these productions
    id_commande_index = production_columns.index('ID_Commande')
    production_command_ids = [row[id_commande_index] for row in productions if row[id_commande_index] is not None]
    
    if production_command_ids:
        placeholders = ", ".join([str(id) for id in production_command_ids])
        query_commandes = text(f"""
            SELECT * FROM Commande
            WHERE ID_Commande IN ({placeholders})
        """)
        result_cmd = connection.execute(query_commandes)
        commandes= result_cmd.fetchall()
        commande_columns= list(result_cmd.keys())
        
        print("\n=== Corresponding Commandes ===")
        cmd_row_list= []
        for row in commandes:
            cmd_row_list.append(list(row))
        print(tabulate(cmd_row_list, headers=commande_columns, tablefmt='pretty'))   
    else:
        print("\n No corresponding Commande IDs found in productions.")
