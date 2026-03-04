import geopandas as gpd
import rasterio
from rasterio.features import rasterize
import os

# Using absolute paths to avoid "No such file" errors
BASE_DIR = r"C:\2nd Term AY 2025-2026\Thesis-final\Thesis\Thesis\backend"

# Adjust these to exactly where your files are
SHP_PATH = os.path.join(BASE_DIR, "ml", "resilience", "manila_barangays", "manila_barangays.shp")
TEMPLATE_TIF = os.path.join(BASE_DIR, "ml", "manila_quadrant", "resized_dem", "manila_clipped_DEM.tif")
OUT_TIF = os.path.join(BASE_DIR, "ml", "resilience", "manila_barangays", "filtered_barangays_psgc.tif")

def recreate_psgc_raster():
    print(f"🚀 Checking Shapefile: {SHP_PATH}")
    if not os.path.exists(SHP_PATH):
        print(f"❌ Error: Shapefile not found at {SHP_PATH}")
        return

    # 1. Load the Shapefile
    gdf = gpd.read_file(SHP_PATH)
    print(f"✅ Loaded Shapefile. Columns found: {list(gdf.columns)}")

    # IMPORTANT: Check if 'psgc_code' exists, if not, change this string to your column name
    col_name = 'psgc_code' 
    if col_name not in gdf.columns:
        print(f"❌ Error: Column '{col_name}' not found. Please check column names above.")
        return

    # 2. Get the grid metadata from your DEM
    with rasterio.open(TEMPLATE_TIF) as src:
        meta = src.meta.copy()
        out_shape = src.shape
        transform = src.transform

    # 3. Update metadata
    meta.update(dtype='int32', count=1, nodata=0, driver='GTiff', compress='lzw')

    # 4. Prepare shapes
    shapes = ((geom, int(value)) for geom, value in zip(gdf.geometry, gdf[col_name]))

    # 5. Rasterize
    with rasterio.open(OUT_TIF, 'w', **meta) as dst:
        burned = rasterize(
            shapes=shapes,
            out_shape=out_shape,
            transform=transform,
            fill=0,
            all_touched=True,
            dtype='int32'
        )
        dst.write(burned, 1)
        
    print(f"🎉 Success! New PSGC raster saved to: {OUT_TIF}")

if __name__ == "__main__":
    recreate_psgc_raster()