npm run client-build
tsc server/*.ts

mkdir dist
mv server/*.js dist/
mv client/dist/ dist/static/