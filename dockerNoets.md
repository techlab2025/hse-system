## default docker

```
services:
  app:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped
```

## docker watch

# commend

docker compose up --watch

```
services:
  app:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped

    develop:
      watch:
        - action: rebuild
          path: .
          ignore:
            - node_modules/
            - dist/
            - .git/



```
