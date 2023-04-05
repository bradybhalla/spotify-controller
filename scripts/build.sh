# clean old builds
npm run clean

# build the client and server
npm run client-build
npm run server-build

# move builds to dist/
mkdir dist

mv server/*.js dist/

mv client/dist/ dist/static/

echo "Done"