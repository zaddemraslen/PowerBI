import pandas as pd  # Importer pandas pour manipuler les données
from colorama import  Fore, Back, Style, init
import io

# read le fichier Excel
fichier_excel = "Matis_Aerospace_cleaned.xlsx"

# Chargement  toutes les feuilles du fichier Excel
excel_file = pd.ExcelFile(fichier_excel)

# Ouvrir un fichier texte pour y écrire les résultats
with open(r"logs\output.txt", "w") as file:
    # Afficher les noms des feuilles
    sheet_names= excel_file.sheet_names

    file.write("sheet names:"+", ".join(sheet_names) + "\n\n")

    # Lire et afficher les données de chaque feuille
    for nom_feuille in sheet_names:
        df = excel_file.parse(nom_feuille)
        
        file.write("================================================================")
        file.write(f"Info for sheet '{nom_feuille}':\n")
        
        #  Afficher les 5 premières lignes de la feuille
        file.write(df.head().to_string() + "\n\n")

        # Capture the DataFrame info into a string
        buffer = io.StringIO()  # Create a buffer to hold the info output
        df.info(buf=buffer)
        
        file.write(buffer.getvalue())  # Write the content of buffer to the file
        file.write("\n\n")  # Separate outputs for each sheet
        
        # Confirmation de l'écriture dans le fichier
    print("Les informations ont été sauvegardées dans le fichier 'output.txt'.")