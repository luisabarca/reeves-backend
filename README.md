# Backend

## Local env

```
npm i
npm run dev
```

## Docker

Create image for backend:

```
npm run docker:build
```

Run the image with on port 4000

```
docker run --rm -p 4000:4000 --name backend -it kr-backend
```