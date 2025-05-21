import pandas as pd

# Input and output file paths
input_file = "Matis_Aerospace_complet.xlsx"
output_file = "Matis_Aerospace_cleaned.xlsx"

# Load Excel file
xls = pd.ExcelFile(input_file)

# To store cleaned sheets
cleaned_sheets = {}

# Helper function to transform numeric fields
def clean_column(series):
    return series.apply(lambda x: abs(int(float(x))) if pd.notnull(x) else x)

# Clean Ressources
if "Ressources" in xls.sheet_names:
    df = xls.parse("Ressources")
    if "Stock_Disponible" in df.columns:
        df["Stock_Disponible"] = clean_column(df["Stock_Disponible"])
    cleaned_sheets["Ressources"] = df

# Clean Stock
if "Stock" in xls.sheet_names:
    df = xls.parse("Stock")
    if "Quantité_Disponible" in df.columns:
        df["Quantité_Disponible"] = clean_column(df["Quantité_Disponible"])
    cleaned_sheets["Stock"] = df

# Clean Commande
commande_df = None
if "Commande" in xls.sheet_names:
    commande_df = xls.parse("Commande")
    if "Quantité" in commande_df.columns:
        commande_df["Quantité"] = clean_column(commande_df["Quantité"])
    cleaned_sheets["Commande"] = commande_df
    
# Clean Équipe
if "Équipe" in xls.sheet_names:
    df = xls.parse("Équipe")
    for col in ["Effectif", "Nombre_Heures_Travaillées"]:
        if col in df.columns:
            df[col] = clean_column(df[col])
    cleaned_sheets["Équipe"] = df

# Clean Production
if "Production" in xls.sheet_names:
    df = xls.parse("Production")
    if "ID_Commande" in df.columns and commande_df is not None and "ID_Commande" in commande_df.columns:
        valid_ids = set(commande_df["ID_Commande"].dropna().astype(str))
        df = df[df["ID_Commande"].astype(str).isin(valid_ids)]
    
    if "Quantité" in df.columns:
        df["Quantité"] = clean_column(df["Quantité"])
    cleaned_sheets["Production"] = df

# Preserve other sheets
for sheet in xls.sheet_names:
    if sheet not in cleaned_sheets:
        cleaned_sheets[sheet] = xls.parse(sheet)

# Write to new Excel file
with pd.ExcelWriter(output_file) as writer:
    for sheet, df in cleaned_sheets.items():
        df.to_excel(writer, sheet_name=sheet, index=False)

print(f"✅ Cleaned data saved to {output_file}")
