FROM mariadb:11.2

RUN apt-get update && \
    apt-get install -y default-mysql-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY init.sh /init.sh
COPY custom-entrypoint.sh /custom-entrypoint.sh
RUN chmod +x /init.sh /custom-entrypoint.sh

ENTRYPOINT ["/custom-entrypoint.sh"]