FROM python:3.11-slim

# environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV GDAL_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/libgdal.so
ENV GEOS_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/libgeos_c.so
ENV PROJ_LIB_PATH=/usr/share/proj
ENV PROJ_LIB=/usr/local/share/proj
ENV PROJ_DATA=/usr/local/share/proj
ENV GDAL_DATA=/usr/local/share/gdal

# work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libpq-dev \
        binutils \
        gdal-bin \
        libgdal-dev \
        postgresql-client \
        wget \
        build-essential \
        autoconf \
        automake \
        libtool \
        pkg-config \
        cmake \
        sqlite3 \
        libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install latest PROJ from source to avoid version conflicts
RUN wget https://download.osgeo.org/proj/proj-9.4.1.tar.gz \
    && tar -xzf proj-9.4.1.tar.gz \
    && cd proj-9.4.1 \
    && mkdir build \
    && cd build \
    && cmake .. -DCMAKE_INSTALL_PREFIX=/usr/local \
    && make -j$(nproc) \
    && make install \
    && cd ../.. \
    && rm -rf proj-9.4.1 proj-9.4.1.tar.gz


RUN ln -s /usr/local/share/proj /usr/share/proj
RUN pip install --no-cache-dir --force-reinstall pyproj rasterio

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]