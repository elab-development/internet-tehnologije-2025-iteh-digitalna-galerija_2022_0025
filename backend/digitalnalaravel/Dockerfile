FROM php:8.2-cli

# Instalacija potrebnih paketa + netcat
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    netcat-openbsd \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

WORKDIR /var/www

COPY . .

# Instalacija Composer-a
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ⬇⬇ OVO JE BITNO
RUN composer install --no-interaction --prefer-source

EXPOSE 8000
