npm run clean

npm run client-build
npm run server-build

mkdir dist
mv server/*.js dist/
mv client/dist/ dist/static/